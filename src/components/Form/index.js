import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMountedState, useMount, useIsomorphicLayoutEffect, ensuredForwardRef } from 'react-use';
import { identity, equals } from 'ramda';
import { useTracked, actionTypes } from '../Store';
import * as utils from './utils';

const Form = ensuredForwardRef(
    (
        {
            messages,
            withDirtyCheck,
            withScroll,
            onClick,
            onChange,
            onReset,
            onInvalid,
            onSubmitting,
            onSubmitted,
            children,
            ...props
        },
        form,
    ) => {
        const button = useRef();
        const isMounted = useMountedState();
        const [state, dispatch] = useTracked();

        useMount(() => {
            // Set the current state of the form on DOM load, and the initial state of the form data.
            dispatch({
                type: actionTypes.initialise,
                payload: {
                    isValid: form.current.checkValidity(),
                    meta: { data: utils.getFormData(form.current) },
                },
            });
        });

        useIsomorphicLayoutEffect(() => {
            withScroll &&
                state.meta.highest &&
                state.meta.highest.firstChild.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                });
        }, [state.meta.active, state.meta.highest, withScroll]);

        const handleSubmitting = useCallback(
            async (event) => {
                event.preventDefault();
                dispatch({ type: actionTypes.submitting });

                const validityState = await utils.submitForm({
                    form,
                    button,
                    messages,
                    event,
                    id: state.meta.id,
                    onInvalid,
                    onSubmitting,
                    onSubmitted,
                });

                button.current = null;

                if (!isMounted()) return;

                validityState.isValid &&
                    dispatch({
                        type: actionTypes.data,
                        payload: { meta: { data: validityState.meta.data } },
                    });

                dispatch({ type: actionTypes.submitted, payload: validityState });
            },
            [form, button, onSubmitting],
        );

        const handleClick = useCallback(
            (event) => {
                onClick(event);

                // Handle the clicks on the form to determine what was used to submit the form, if any.
                utils.isSubmitButton(event.target) && (button.current = event.target);
            },
            [onClick],
        );

        const handleChange = useCallback(
            (event) => {
                onChange(event);

                withDirtyCheck &&
                    isMounted() &&
                    dispatch({
                        type: actionTypes.withDirtyCheck,
                        payload: {
                            isDirty: !equals(utils.getFormData(form.current), state.meta.data),
                        },
                    });
            },
            [state.meta.data, withDirtyCheck, onChange],
        );

        const handleReset = useCallback(
            (event) => {
                onReset(event);

                isMounted() &&
                    dispatch({
                        type: actionTypes.reset,
                        payload: { isValid: form.current.checkValidity() },
                    });
            },
            [form, onReset],
        );

        return (
            <form
                ref={form}
                noValidate
                {...props}
                onSubmit={handleSubmitting}
                onReset={handleReset}
                onClick={handleClick}
                onChange={handleChange}
            >
                {utils.isFunction(children) ? children(state) : children}
            </form>
        );
    },
);

Form.propTypes = {
    messages: PropTypes.shape(
        PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    ),
    withScroll: PropTypes.bool,
    withDirtyCheck: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    onInvalid: PropTypes.func,
    onSubmitting: PropTypes.func,
    onSubmitted: PropTypes.func,
};

Form.defaultProps = {
    messages: {},
    withScroll: false,
    children: <></>,
    onClick: identity,
    onChange: identity,
    onReset: identity,
    onInvalid: identity,
    onSubmitting: identity,
    onSubmitted: identity,
};

export default Form;
