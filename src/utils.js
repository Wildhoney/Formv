export class ValidationError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

export const handleValidation = ({
    formElement,
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
        if (!formElement.current.checkValidity()) {
            const invalidElements = invalidElementsFromForm([
                ...formElement.current.elements,
            ]);
            setHighest(invalidElements);
            return void setMessages(getValidationMessages(invalidElements));
        }

        await onSubmitted(event);
    } catch (error) {
        if (error instanceof ValidationError) {
            onInvalid(event);
            setHighest(invalidElementsFromAPI(formElement, error.message));
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

export const invalidElementsFromAPI = (formElement, message) => {
    const invalidElements = Object.keys(message);
    return [...formElement.current.elements].filter(
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

export const getEncapsulatedField = (formElement, fieldElement) =>
    !formElement.current
        ? null
        : [...formElement.current.elements].find(element =>
              fieldElement.current.contains(element),
          ) || null;

export const isFunction = a => typeof a === 'function';

export const getHighestElement = elements => {
    const [element] = elements.reduce(
        ([currentName, currentValue], element) => {
            const { top: value } = element.getBoundingClientRect();
            return value < currentValue
                ? [element.name, value]
                : [currentName, currentValue];
        },
        [null, Infinity],
    );

    return element;
};
