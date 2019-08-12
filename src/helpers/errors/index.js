class FormError extends Error {
    constructor(messages) {
        super();
        this.messages = messages;
    }
}

export class GenericError extends FormError {}

export class ValidationError extends FormError {}