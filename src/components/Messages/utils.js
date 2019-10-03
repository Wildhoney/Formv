export function getMessages(field, customMessages) {
    const messages = (() => {
        for (var key in field.validity) {
            const isInvalid = key !== 'valid' && field.validity[key];
            if (isInvalid) return customMessages[key] || field.validationMessage;
        }
    })();

    return [].concat(messages);
}

export function handleScroll({ successMessage, genericMessages, noScroll }) {
    return node => {
        if (!node) return;
        const container = successMessage ? node.firstChild : node;

        !noScroll &&
            container &&
            (successMessage || genericMessages.length > 0) &&
            setTimeout(() => container.scrollIntoView({ block: 'start' }));
    };
}
