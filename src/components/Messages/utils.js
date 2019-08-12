export function getMessages(field, customMessages) {
    const messages = (() => {
        for (var key in field.validity) {
            const isInvalid = key !== 'valid' && field.validity[key];

            if (isInvalid) {
                const message = customMessages[key] || field.validationMessage;
                // field.setCustomValidity(message);
                return message;
            }
        }
    })();

    return [].concat(messages);
}
