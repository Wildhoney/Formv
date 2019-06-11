export function findInput(form, field) {
    if (!form || !field) return null;
    return [...form.elements].find(element => field.contains(element)) || null;
}

export function formatMessages(input, customMessages, messages = []) {
    if (!input || input.validity.valid || messages.length === 0) return messages;

    const key = (() => {
        for (var key in input.validity) {
            if (key !== 'valid' && input.validity[key]) {
                return key;
            }
        }
    })();

    return messages.map(message => customMessages[key] || message);
}

export function handleScroll(input, messages, context, field) {
    return () => {
        if (input) {
            input.classList.remove('invalid');
            messages.length > 0 && input.classList.add('invalid');
            !context.noScroll &&
                context.highest === input.name &&
                field.firstChild.scrollIntoView &&
                setTimeout(() => field.firstChild.scrollIntoView({ behavior: 'smooth' }));
        }
    };
}

