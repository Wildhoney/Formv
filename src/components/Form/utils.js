import { useCallback } from 'react';
import Error from '../../helpers/errors';
import Success from '../../helpers/success';

export function handleSubmit({ form, button, actions, onInvalid, onSubmitting, onSubmitted }) {
    return useCallback(
        async event => {
            event.preventDefault();

            // Clear all of the previous invalid messages.
            actions.reset();
            actions.isLoading(true);

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
                if (requiresValidation && !form.checkValidity()) throw new Error.Validation({});

                // Both the custom validation and native validation have passed successfully. We
                // do a check on whether the developer provided a success message which we can render.
                const result = await onSubmitted(event);
                result instanceof Success && actions.setSuccessMessage(result.message);
            } catch (error) {
                // We always invoke the `onInvalid` callback even if the errors are not necessarily
                // applicable to Formv validation.
                onInvalid(event);

                if (error instanceof Error.Validation) {
                    // Feed the API validation errors back into the component.
                    const invalidFields = collateInvalidFields(form, error.messages);
                    actions.setInvalid(invalidFields);
                    actions.setScrollField(getHighestElement(invalidFields));
                    return void actions.setValidityMessages(error.messages);
                }

                if (error instanceof Error.Generic) {
                    // Feed any generic API error messages back into the component.
                    return void actions.setGenericMessages(error.messages);
                }

                // Otherwise we'll re-throw any other exceptions.
                throw error;
            } finally {
                // Modify the state to show that everything has completed, and we're in either a
                // success or error state.
                actions.isLoading(false);
            }
        },
        [form, button, actions, onInvalid, onSubmitting, onSubmitted],
    );
}

export function handleClick({ button }) {
    return useCallback(event => isSubmitButton(event.target) && (button.current = event.target), [
        button,
    ]);
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

function collateInvalidFields(form, messages = {}) {
    const keys = Object.keys(messages);

    return Array.from(form.elements).filter(element => {
        return !element.validity.valid || keys.includes(element.name);
    });
}

function getHighestElement(invalidFields) {
    const [element] = invalidFields.reduce(
        ([highestElement, elementPosition], element) => {
            const position = element.getBoundingClientRect();

            return position.top < elementPosition
                ? [element, position.top]
                : [highestElement, elementPosition];
        },
        [null, Infinity],
    );

    return element;
}

function isSubmitButton(element) {
    const name = element.nodeName.toLowerCase();
    const type = element.getAttribute('type');

    if (name === 'input' && type === 'submit') return true;
    if ((name === 'button' && type === 'submit') || type === null) return true;
}

export function getStyles(isLegacy) {
    return isLegacy ? {} : { display: 'contents' };
}

function isRelatedException(error) {
    return error instanceof Error.Generic || error instanceof Error.Validation;
}
