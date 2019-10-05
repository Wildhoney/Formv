class FormvError extends Error {
    constructor(messages) {
        super();
        this.messages = messages;
    }
}

export class FormvSuccess {
    constructor(message) {
        this.message = message;
    }
}

export class FormvGenericError extends FormvError {}

export class FormvValidationError extends FormvError {}
