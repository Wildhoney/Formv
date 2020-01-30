import { useCallback, useReducer, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { equals, isEmpty } from 'ramda';
import * as feedback from '../../helpers/feedback';

export function getStyles() {
    return { border: 0, padding: 0, margin: 0 };
}

export function isFunction(a) {
    return typeof a === 'function';
}

export function useDuck(duck, initialState) {
    const [state, dispatch] = useReducer(duck.reducer, initialState);
    const actions = useMemo(() => duck.bindActions(dispatch), [dispatch]);
    return [state, actions];
}

export function handleClick({ button }) {
    return useCallback(event => isSubmitButton(event.target) && (button.current = event.target), [
        button,
    ]);
}

export function isSubmitButton(element) {
    const name = element.nodeName.toLowerCase();
    const type = element.getAttribute('type');

    if (name === 'input' && type === 'submit') return true;
    if (name === 'button' && (type === 'submit' || type === null)) return true;
    return false;
}

export function handleSubmit({
    form,
    button,
    messages,
    setHighestField,
    isMounted,
    actions,
    onInvalid,
    onSubmitting,
    onSubmitted,
}) {
    return useCallback(
        async event => {
            event.preventDefault();

            // Clear all of the previous invalid messages and initiate the loading.
            actions.reset();
            actions.isSubmitting(true);

            // Reset the highest field computation.
            setHighestField(null);

            // Remove the invalid class name from all form fields.
            Array.from(form.current.elements).forEach(
                field => field && field.classList.remove('invalid'),
            );

            // Remove the invalid class name from the form.
            form.current && form.current.classList.remove('invalid');

            // Determine if the form requires validation based on the `formnovalidate` field.
            const requiresValidation =
                !button.current || !button.current.hasAttribute('formnovalidate');

            try {
                try {
                    // Invoke the `onSubmitting` callback so the user can handle the form state
                    // change, and have an opportunity to raise early generic and/or validation
                    // errors.
                    onSubmitting(event);
                } catch (error) {
                    // We'll only re-throw errors if they are non-Formv errors, or if they are Formv
                    // errors then only in instances where the form has opted into validation.
                    if (
                        (requiresValidation && isRelatedException(error)) ||
                        !isRelatedException(error)
                    )
                        throw error;
                }

                // Check to see whether the validation passes the native validation, and if not
                // throw an empty validation error to collect the error messages directly from
                // each of the fields.
                if (requiresValidation && !form.current.checkValidity())
                    throw new feedback.FormvValidationError({});

                // Both the custom validation and native validation have passed successfully. We
                // do a check on whether the developer provided a success message which we can render.
                const result = await onSubmitted(event);
                actions.setValidity(true);
                isMounted() &&
                    result instanceof feedback.FormvSuccess &&
                    actions.setSuccessMessages(result.message);
            } catch (error) {
                if (error instanceof feedback.FormvValidationError) {
                    // Feed the API validation errors back into the component.
                    const invalidFields = collateInvalidFields(form, error.messages);

                    invalidFields.forEach(field => {
                        // Apply the invalid class name to each invalid field.
                        field && field.classList.add('invalid');
                    });

                    // Hand over the invalid fields to the state, and set the validation messages.
                    actions.setInvalidFields(invalidFields);
                    actions.setValidity(false);
                    return void actions.setValidityMessages(
                        getMessages(invalidFields, messages, error.messages),
                    );
                }

                if (error instanceof feedback.FormvGenericError) {
                    // Feed any generic API error messages back into the component.
                    actions.setValidity(false);
                    return void actions.setGenericMessages(error.messages);
                }

                // We always invoke the `onInvalid` callback even if the errors are not necessarily
                // applicable to Formv validation.
                onInvalid(event);

                // Apply the invalid class name to the form.
                form.current && form.current.classList.add('invalid');

                // Otherwise we'll re-throw any other exceptions.
                throw error;
            } finally {
                // Modify the state to show that everything has completed, and we're in either a
                // success or error state.
                isMounted() && actions.isSubmitting(false);

                // Finally modify the ID to signify a change in state.
                isMounted() && actions.id();
            }
        },
        [form, button, actions, messages, setHighestField, onInvalid, onSubmitting, onSubmitted],
    );
}

export function handleInvalid({ onInvalid }) {
    return useCallback(onInvalid, [onInvalid]);
}

export function handleReset({ form, actions, onReset }) {
    return useCallback(
        async event => {
            event.preventDefault();
            await onReset(event);
            actions.reset(form.current.checkValidity());
        },
        [onReset],
    );
}

export function getFormData(form) {
    const data = new FormData(form);
    return [...data.keys(), ...data.values()];
}

export function handleChange({ form, dirtyCheck, actions }) {
    const [state, setState] = useState(null);

    // Set the initial form state.
    useEffectOnce(() => {
        if (dirtyCheck) {
            actions.setDirty(false);
            setState(getFormData(form.current));
        }
    }, [form, dirtyCheck]);

    return useCallback(
        event => {
            if (dirtyCheck) {
                // Handle the dirty checking of the form.
                const newState = getFormData(event.target.form);
                actions.setDirty(!equals(newState, state));
            }
        },
        [state, dirtyCheck],
    );
}

export function getValidationMessages(field, refinedMessages) {
    const key = getValidationKey(field);
    return (
        (refinedMessages[field.name] && refinedMessages[field.name][key]) || field.validationMessage
    );
}

export function collateInvalidFields(form, messages = {}) {
    const keys = Object.keys(messages);

    return Array.from(form.current.elements).filter(element => {
        return !element.validity.valid || keys.includes(element.name);
    });
}

export function isRelatedException(error) {
    return (
        error instanceof feedback.FormvGenericError ||
        error instanceof feedback.FormvValidationError
    );
}

export function mergeMessages(formMessages, fieldMessages) {
    if (isEmpty(fieldMessages)) return formMessages;
    return { ...formMessages, ...Object.assign(...fieldMessages) };
}

export function getValidationKey(field) {
    for (var key in field.validity) {
        const isInvalid = key !== 'valid' && field.validity[key];
        if (isInvalid) return key;
    }
}

export function getMessages(fields, refinedMessages, customErrorMessages) {
    const validationMessages = {};

    fields.forEach(field => {
        const messages = (() => getValidationMessages(field, refinedMessages))();

        [messages, customErrorMessages[field.name]]
            .flat()
            .filter(uniqueList)
            .filter(Boolean)
            .forEach(message => {
                if (!validationMessages[field.name]) validationMessages[field.name] = [];
                validationMessages[field.name].push(message);
            });
    });

    return validationMessages;
}

function uniqueList(value, index, list) {
    return list.indexOf(value) === index;
}
