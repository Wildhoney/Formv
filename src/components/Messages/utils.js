export { getStyles } from '../Form/utils';

export function handleScroll({ successMessage, genericMessages, noScroll }) {
    return container => {
        !noScroll &&
            container &&
            (successMessage || genericMessages.length > 0) &&
            setTimeout(() => container.firstChild.scrollIntoView({ block: 'start' }));
    };
}

export function getMessages(fields, customMessages) {
    const validationMessages = [];

    fields.forEach(field => {
        const messages = (() => {
            for (var key in field.validity) {
                const isInvalid = key !== 'valid' && field.validity[key];
                if (isInvalid) return customMessages[key] || field.validationMessage;
            }
        })();
        validationMessages.push(messages);
    });

    return validationMessages.flat().filter(uniqueList);
}

function uniqueList(value, index, list) {
    return list.indexOf(value) === index;
}
