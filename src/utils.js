export class ValidationError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

export const handleValidation = ({
    form,
    onSubmit,
    onInvalid,
    setMessages,
    setDisabled,
    setHighest,
}) => async event => {
    event.preventDefault();

    setMessages({});
    setDisabled(true);

    const [onSubmitted, onSubmitting = () => {}] = []
        .concat(onSubmit)
        .reverse();
    onSubmitting(event);

    try {
        if (!form.checkValidity()) {
            const invalidElements = invalidElementsFromForm([...form.elements]);
            setHighest(getHighestElement(invalidElements));
            return void setMessages(getValidationMessages(invalidElements));
        }

        await onSubmitted(event);
    } catch (error) {
        if (error instanceof ValidationError) {
            onInvalid(event);
            setHighest(
                getHighestElement(invalidElementsFromAPI(form, error.message)),
            );
            return void setMessages(error.message);
        }

        // Re-throw the error as it's not one we're able to handle.
        throw error;
    } finally {
        setDisabled(false);
    }
};

export const invalidElementsFromForm = elements =>
    elements.filter(element => !element.validity.valid && element.name);

export const invalidElementsFromAPI = (form, message) => {
    const invalidElements = Object.keys(message);
    return [...form.elements].filter(
        element => element.name && invalidElements.includes(element.name),
    );
};

export const getValidationMessages = elements =>
    elements.reduce(
        (accum, element) => ({
            ...accum,
            [element.name]: element.validationMessage,
        }),
        {},
    );

export const getEncapsulatedField = (form, field) =>
    !form || !field
        ? null
        : [...form.elements].find(element => field.contains(element)) || null;

export const isFunction = a => typeof a === 'function';

export const getHighestElement = elements => {
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
};

export const formatCustomMessages = (input, customMessages, messages) => {
    if (!input || input.validity.valid || messages.length === 0) {
        return messages;
    }

    const key = (() => {
        for (var key in input.validity) {
            if (key !== 'valid' && input.validity[key]) {
                return key;
            }
        }
    })();

    return messages.map(message => customMessages[key] || message);
};
