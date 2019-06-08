export class ValidationError extends Error {}

export const handleValidation = ({
    setMessages,
    formElement,
    onSubmit,
    setDisabled,
}) => async event => {
    event.preventDefault();

    setMessages({});
    setDisabled(true);

    try {
        if (!formElement.current.checkValidity()) {
            const invalidElements = getInvalidElements([
                ...formElement.current.elements,
            ]);
            return void setMessages(getValidationMessages(invalidElements));
        }

        await onSubmit(event);
    } catch (error) {
        if (error instanceof ValidationError) {
            return void setMessages(error);
        }

        // Re-throw the error as it's not one we're able to handle.
        throw error;
    } finally {
        setDisabled(false);
    }
};

export const getInvalidElements = elements =>
    elements.filter(element => !element.validity.valid && element.name);

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
          );
