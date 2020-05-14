import React, { useCallback, useRef, useState } from 'react';
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
            withoutScroll,
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

        // Used for tracking the state of the form.
        const [formData, setFormData] = useState();

        const isMounted = useMountedState();
        const [state, dispatch] = useTracked();

        useMount(() => {
            // Set the initial state of the form data.
            setFormData(utils.getFormData(form.current));

            // Set the current state of the form on DOM load.
            dispatch({
                type: actionTypes.initialise,
                payload: { isValid: form.current.checkValidity() },
            });
        });

        useIsomorphicLayoutEffect(() => {
            !withoutScroll &&
                state.meta.highest &&
                state.meta.highest.firstChild.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth',
                });
        }, [state.meta.active, state.meta.highest]);

        const handleSubmitting = useCallback(
            async (event) => {
                event.preventDefault();
                dispatch({ type: actionTypes.submitting });

                const result = await utils.submitForm({
                    form,
                    button,
                    messages,
                    event,
                    id: state.meta.id,
                    onInvalid,
                    onSubmitting,
                    onSubmitted,
                });

                if (!isMounted()) return;

                result.isValid && setFormData(result.meta.data);
                dispatch({ type: actionTypes.submitted, payload: result });
                button.current = null;
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

                if (!withDirtyCheck || !isMounted()) return;

                const newState = utils.getFormData(form.current);

                dispatch({
                    type: actionTypes.withDirtyCheck,
                    payload: { isDirty: !equals(newState, formData) },
                });
            },
            [formData, withDirtyCheck, onChange],
        );

        const handleReset = useCallback(
            async (event) => {
                event.preventDefault();
                await onReset(event);

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
    withDirtyCheck: PropTypes.bool.isRequired,
    withoutScroll: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    onInvalid: PropTypes.func,
    onSubmitting: PropTypes.func,
    onSubmitted: PropTypes.func,
};

Form.defaultProps = {
    withoutScroll: false,
    onClick: identity,
    onChange: identity,
    onReset: identity,
    onInvalid: identity,
    onSubmitting: identity,
    onSubmitted: identity,
};

export default Form;
