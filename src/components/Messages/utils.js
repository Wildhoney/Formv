export function getMessages(field, customMessages) {
    const messages = (() => {
        for (var key in field.validity) {
            const isInvalid = key !== 'valid' && field.validity[key];
            if (isInvalid) return customMessages[key] || field.validationMessage;
        }
    })();

    return [].concat(messages);
}
