class FormError extends Error {
    constructor(messages) {
        super();
        this.messages = messages;
    }
}

export class GenericError extends FormError {}

export class ValidationError extends FormError {}

export function findSubmitButton(form) {
    return (
        [document.activeElement || null, ...form.current.elements].find(
            (element, index) => {
                if (!element) return false;
                const name = element.nodeName.toLowerCase();
                const type = element.getAttribute('type');
                const isInForm =
                    index > 0 ||
                    Boolean(
                        [...form.current.elements].find(
                            currentElement => currentElement === element,
                        ),
                    );
                const isInput = name === 'input' && type === 'submit';
                const isButton =
                    !['reset', 'button'].includes(type) && name === 'button';
                return isInForm && (isInput || isButton || false);
            },
        ) || null
    );
}

export function isFormValidatable(form) {
    const button = findSubmitButton(form);
    return button ? !button.hasAttribute('formnovalidate') : true;
}

export function handleFormValidation({ form, dispatch, onSubmit, onInvalid }) {
    return async event => {
        event.preventDefault();
        dispatch({ type: 'reset' });

        // Invoke the developer's `onSubmit` handler if specified as an array of functions.
        const [onSubmitted, onSubmitting = () => {}] = []
            .concat(onSubmit)
            .reverse();
        onSubmitting(event);

        try {
            if (isFormValidatable(form) && !form.current.checkValidity()) {
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
                        highest: form.current,
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

export function getClassNames(className) {
    return ['formv', className].join(' ').trim();
}

export function handleScroll({ current: element }, state, noScroll) {
    !noScroll &&
        state.highestElement &&
        setTimeout(() => {
            const options = { behavior: 'smooth' };
            if (element.scrollIntoViewIfNeeded)
                element.scrollIntoViewIfNeeded(options);
            else if (element.scrollIntoView) element.scrollIntoView(options);
        });
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
        ([currentElement, currentValue], element) => {
            const { top: value } = element.getBoundingClientRect();
            return value < currentValue && element.name
                ? [element, value]
                : [currentElement, currentValue];
        },
        [null, Infinity],
    );

    return element;
}
