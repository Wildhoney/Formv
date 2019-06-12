export function getClassNames(className) {
    return ['formv', className].join(' ').trim();
}

class FormError extends Error {
    constructor(messages) {
        super();
        this.messages = messages;
    }
}

export class GenericError extends FormError {}

export class ValidationError extends FormError {}

export function handleValidation({ form, onSubmit, onInvalid, dispatch }) {
    return async event => {
        event.preventDefault();

        dispatch({ type: 'reset' });

        // Invoke the developer's `onSubmit` handler if specified as an array of functions.
        const [onSubmitted, onSubmitting = () => {}] = []
            .concat(onSubmit)
            .reverse();
        onSubmitting(event);

        try {
            if (!form.current.checkValidity()) {
                const elements = getInvalidFormElements(form.current);
                return void dispatch({
                    type: 'messages/validity',
                    payload: {
                        highest: determineHighestElement(elements),
                        messages: getValidationMessages(elements),
                    },
                });
            }

            // Invoke the developer's `onSubmit` handler.
            await onSubmitted(event);
        } catch (error) {
            if (error instanceof ValidationError) {
                onInvalid(event);
                const elements = mapInvalidFormElements(
                    form.current,
                    error.messages,
                );
                return void dispatch({
                    type: 'messages/validity',
                    payload: {
                        highest: determineHighestElement(elements),
                        messages: error.messages,
                    },
                });
            }

            if (error instanceof GenericError) {
                onInvalid(event);
                return void dispatch({
                    type: 'messages/generic',
                    payload: {
                        highest: form,
                        messages: error.messages,
                    },
                });
            }

            // Re-throw the error as it's not one we're able to handle.
            throw error;
        } finally {
            dispatch({ type: 'disabled', payload: false });
        }
    };
}

export function handleScroll(form, state, noScroll) {
    !noScroll &&
        state.highestElement &&
        state.highestElement === form.current &&
        form.current.scrollIntoView &&
        setTimeout(() =>
            state.elements.form.scrollIntoView({ behavior: 'smooth' }),
        );
}

export function getInvalidFormElements(form) {
    return [...form.elements].filter(
        element => !element.validity.valid && element.name,
    );
}

export function mapInvalidFormElements(form, messages) {
    const invalidElements = Object.keys(messages);
    return [...form.elements].filter(
        element => element.name && invalidElements.includes(element.name),
    );
}

export function getValidationMessages(elements) {
    return elements.reduce(
        (accum, element) => ({
            ...accum,
            [element.name]: element.validationMessage,
        }),
        {},
    );
}

export function determineHighestElement(elements) {
    const [element] = elements.reduce(
        ([currentName, currentValue], element) => {
            const { top: value } = element.getBoundingClientRect();
            return value < currentValue && element.name
                ? [element.name, value]
                : [currentName, currentValue];
        },
        [null, Infinity],
    );

    return element;
}
