class FormError extends Error {
    constructor(messages) {
        super();
        this.messages = messages;
    }
}

class Generic extends FormError {}
class Validation extends FormError {}

export default { Generic, Validation };
