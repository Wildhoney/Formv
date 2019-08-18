import { useCallback } from 'react';
import * as errors from '../../helpers/errors';

export function handleSubmit({
    form,
    button,
    actions,
    onSubmitting,
    onSubmitted,
}) {
    return useCallback(
        async event => {
            event.preventDefault();
            onSubmitting(event);

            // Clear all of the previous invalid messages.
            actions.reset();
            actions.isLoading(true);

            // Determine if the form requires validation based on the `formnovalidate` field.
            const requiresValidation =
                !button.current ||
                !button.current.hasAttribute('formnovalidate');

            try {
                if (requiresValidation && !form.checkValidity()) {
                    // Collate all of the invalid fields that failed validation.
                    const invalidFields = collateInvalidFields(form);
                    actions.setScrollField(getHighestElement(invalidFields));
                    return void actions.setInvalid(invalidFields);
                }

                // When the form passes front-end validation, invoked the submitted
                // handler and catch any thrown errors.
                await onSubmitted(event);
            } catch (error) {
                if (error instanceof errors.ValidationError) {
                    // Feed the API validation errors back into the component.
                    const invalidFields = collateInvalidFields(
                        form,
                        error.messages,
                    );
                    actions.setInvalid(invalidFields);
                    actions.setScrollField(getHighestElement(invalidFields));
                    return void actions.setValidityMessages(error.messages);
                }

                if (error instanceof errors.GenericError) {
                    // Feed any generic API error messages back into the component.
                    return void actions.setGenericMessages(error.messages);
                }

                // Otherwise we'll re-throw any other exceptions.
                throw error;
            } finally {
                actions.isLoading(false);
            }
        },
        [form, onSubmitted, onSubmitting],
    );
}

export function handleClick({ button }) {
    return useCallback(
        event =>
            isSubmitButton(event.target) && (button.current = event.target),
    );
}

export function handleReset({ actions, onReset }) {
    return useCallback(event => {
        actions.reset();
        onReset(event);
    });
}

export function handleInvalid({ onInvalid }) {
    return useCallback(event => {
        onInvalid(event);
    });
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
            const { top: value } = element.getBoundingClientRect();

            return value < elementPosition
                ? [element, value]
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
