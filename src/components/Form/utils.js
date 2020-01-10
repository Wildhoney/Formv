import { useCallback, useReducer, useMemo } from 'react';
import * as feedback from '../../helpers/feedback';

export function getStyles() {
    return { border: 0, padding: 0, margin: 0 };
}

export function isFunction(a) {
    return typeof a === 'function';
}

export function useDuck(duck) {
    const [state, dispatch] = useReducer(duck.reducer, duck.initialState);
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
            actions.isLoading(true);

            // Remove the invalid class name from all form fields.
            Array.from(form.current.elements).forEach(field => field.classList.remove('invalid'));

            // Remove the invalid class name from the form.
            form.current.classList.remove('invalid');

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
                isMounted() &&
                    result instanceof feedback.FormvSuccess &&
                    actions.setSuccessMessages(result.message);
            } catch (error) {
                if (error instanceof feedback.FormvValidationError) {
                    // Feed the API validation errors back into the component.
                    const invalidFields = collateInvalidFields(form, error.messages);

                    invalidFields.forEach(field => {
                        // Apply the invalid class name to each invalid field.
                        field.classList.add('invalid');
                    });

                    return void actions.setValidityMessages(
                        getMessages(invalidFields, messages, error.messages),
                    );
                }

                if (error instanceof feedback.FormvGenericError) {
                    // Feed any generic API error messages back into the component.
                    return void actions.setGenericMessages(error.messages);
                }

                // We always invoke the `onInvalid` callback even if the errors are not necessarily
                // applicable to Formv validation.
                onInvalid(event);

                // Apply the invalid class name to the form.
                form.current.classList.add('invalid');

                // Otherwise we'll re-throw any other exceptions.
                throw error;
            } finally {
                // Modify the state to show that everything has completed, and we're in either a
                // success or error state.
                isMounted() && actions.isLoading(false);
            }
        },
        [form, button, actions, onInvalid, onSubmitting, onSubmitted],
    );
}

export function handleReset({ actions, onReset }) {
    return useCallback(
        event => {
            actions.reset();
            event.preventDefault();
            onReset(event);
        },
        [onReset],
    );
}

export function handleInvalid({ onInvalid }) {
    return onInvalid;
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

export function getMessages(fields, refinedMessages, customErrorMessages) {
    const validationMessages = {};

    fields.forEach(field => {
        const messages = (() => {
            for (var key in field.validity) {
                const isInvalid = key !== 'valid' && field.validity[key];
                if (isInvalid) return refinedMessages[field.name][key] || field.validationMessage;
            }
        })();

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
