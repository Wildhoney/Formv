export function findContainedInput({ current: form }, field) {
    if (!form || !field) return null;
    return [...form.elements].find(element => field.contains(element)) || null;
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

export function handleInputInvalidation(input, messages, context, field) {
    if (input) {
        input.classList.remove('invalid');
        messages.length > 0 && input.classList.add('invalid');
        !context.noScroll &&
            context.highestElement === input &&
            field.firstChild.scrollIntoView &&
            setTimeout(() =>
                field.firstChild.scrollIntoView({ behavior: 'smooth' }),
            );
    }
}
