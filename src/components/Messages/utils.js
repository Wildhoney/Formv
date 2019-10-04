export { getStyles } from '../Form/utils';

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
    return container => {
        if (!container) return;

        !noScroll &&
            container &&
            (successMessage || genericMessages.length > 0) &&
            setTimeout(() => container.firstChild.scrollIntoView({ block: 'start' }));
    };
}
