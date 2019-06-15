export function findContainedInput(form, field) {
    if (!form.current || !field) return null;
    return (
        [...form.current.elements].find(element => field.contains(element)) ||
        null
    );
}

export function mapCustomMessages(input, customMessages, messages = []) {
    if (!input || input.validity.valid || messages.length === 0)
        return messages;

    const key = (() => {
        for (var key in input.validity) {
            if (key !== 'valid' && input.validity[key]) {
                return key;
            }
        }
    })();

    return messages.map(message => customMessages[key] || message);
}

export function applyInputClassNames(input, messages) {
    if (input) {
        input.classList.remove('invalid');
        messages.length > 0 && input.classList.add('invalid');
    }
}
