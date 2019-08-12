import { useCallback } from 'react';
import * as errors from '../../helpers/errors';

export function handleSubmit({ form, actions, onSubmitting, onSubmitted }) {
    return useCallback(
        async event => {
            event.preventDefault();
            onSubmitting(event);

            // Clear all of the previous invalid messages.
            actions.reset();
            actions.isLoading(true);

            try {
                // Collate all of the invalid fields that failed validation.
                !form.checkValidity() &&
                    actions.setInvalid(collateInvalidFields(form));

                // When the form passes front-end validation, invoked the submitted
                // handler and catch any thrown errors.
                form.checkValidity() && (await onSubmitted(event));
            } catch (error) {
                
                if (error instanceof errors.ValidationError) {
                    // Feed the API validation errors back into the component.
                    actions.setInvalid(
                        collateInvalidFields(form, error.messages),
                        );
                        // actions.setValidityMessages(error.messages)
                }
                
            } finally {
                actions.isLoading(false);
            }
        },
        [form, onSubmitted, onSubmitting],
    );
}

export function handleReset({ onReset }) {
    return useCallback(event => {
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
