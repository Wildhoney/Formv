import React, { useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMountedState, useMount, useIsomorphicLayoutEffect, ensuredForwardRef } from 'react-use';
import { identity } from 'ramda';
import { useTracked, actions } from '../Store';
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
            onUpdate,
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
            dispatch(actions.initialise(form));
        });

        useEffect(() => {
            // Useful callback for rare occasions where you need the state in a parent above the <Form /> component.
            // Such as when the form has an ID and the input's have form attributes to connect them to the form.
            onUpdate(state);
        }, [state]);

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
                dispatch(actions.submitting());

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
                isMounted() && dispatch(actions.submitted(validityState));
            },
            [form, button, onSubmitting, onInvalid, onSubmitted],
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
                    dispatch(actions.dirtyCheck(form, state.meta.data));
            },
            [state.meta.data, withDirtyCheck, onChange],
        );

        const handleReset = useCallback(
            (event) => {
                onReset(event);

                isMounted() && dispatch(actions.reset(form));
            },
            [form, onReset],
        );

        return (
            <form
                ref={form}
                noValidate
                {...props}
                onClick={handleClick}
                onChange={handleChange}
                onReset={handleReset}
                onSubmit={handleSubmitting}
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
    onUpdate: PropTypes.func,
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
    onUpdate: identity,
    onInvalid: identity,
    onSubmitting: identity,
    onSubmitted: identity,
};

export default Form;
