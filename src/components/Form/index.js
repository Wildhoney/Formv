import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useMountedState, useMount, useIsomorphicLayoutEffect } from 'react-use';
import { identity, equals } from 'ramda';
import { useTracked, actionTypes } from '../Store';
import * as utils from './utils';

export default function Form({
    messages,
    dirtyCheck,
    disableFields,
    onClick,
    onChange,
    onReset,
    onInvalid,
    onSubmitting,
    onSubmitted,
    children,
    ...props
}) {
    const form = useRef();
    const fieldset = useRef();
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
        state.meta.active && state.meta.active.focus();
    }, [state.meta.active]);

    const handleSubmitting = useCallback(
        async (event) => {
            event.preventDefault();
            dispatch({ type: actionTypes.submitting });

            const result = await utils.submitForm({
                form,
                button,
                messages,
                event,
                onInvalid,
                onSubmitting,
                onSubmitted,
            });

            if (!isMounted()) return;

            result.isValid && setFormData(result.meta.data);
            dispatch({ type: actionTypes.submitted, payload: result });
            button.current = null;
        },
        [form, fieldset, button, onSubmitting],
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

            if (!dirtyCheck || !isMounted()) return;

            const newState = utils.getFormData(form.current);

            dispatch({
                type: actionTypes.dirtyCheck,
                payload: { isDirty: !equals(newState, formData) },
            });
        },
        [formData, dirtyCheck, onChange],
    );

    const handleReset = useCallback(
        async (event) => {
            event.preventDefault();
            await onReset(event);

            if (!isMounted()) return;

            // Remove the invalid class name from the form.
            form.current && form.current.classList.remove('invalid');

            // Remove the invalid class name from all form fields.
            Array.from(form.current.elements).forEach(
                (field) => field && field.classList.remove('invalid'),
            );

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
            <fieldset
                ref={fieldset}
                disabled={disableFields ? state.isSubmitting : false}
                style={{ display: 'contents' }}
            >
                {utils.isFunction(children) ? children(state) : children}
            </fieldset>
        </form>
    );
}

Form.propTypes = {
    messages: PropTypes.shape(
        PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
    ),
    dirtyCheck: PropTypes.bool,
    disableFields: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    onInvalid: PropTypes.func,
    onSubmitting: PropTypes.func,
    onSubmitted: PropTypes.func,
};

Form.defaultProps = {
    dirtyCheck: false,
    disableFields: true,
    onClick: identity,
    onChange: identity,
    onReset: identity,
    onInvalid: identity,
    onSubmitting: identity,
    onSubmitted: identity,
};
