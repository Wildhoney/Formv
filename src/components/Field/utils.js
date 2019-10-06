import { useCallback } from 'react';
import { getMessages } from '../Messages/utils';

export { getStyles } from '../Form/utils';

export function isBefore(x) {
    return x === 'before';
}

export function isAfter(x) {
    return x === 'after';
}

export function handleField({ form, fields, messages, setContainer, setFields }) {
    return useCallback(
        container => {
            setContainer(container);
            setFields(locateFields(form, container));

            fields.forEach(field =>
                field.addEventListener('invalid', ({ target }) => {
                    target.setCustomValidity(getMessages(field, messages)[0]);
                }),
            );
        },
        [form, setFields],
    );
}

export function handleScroll({ store, container, noScroll }) {
    if (!container || !store.scrollField) return;
    container.contains(store.scrollField) &&
        !noScroll &&
        setTimeout(() => container.firstChild.scrollIntoView({ block: 'start' }));
}

export function locateFields(form, field) {
    if (!form || !field) return [];
    return [...form.elements].filter(element => field.contains(element));
}

export function getMessageProps({ context, fields, messages, names }) {
    const validityMessages = Object.entries(context.store.validityMessages)
        .reduce((accum, [name, message]) => {
            return names.includes(name) ? [...accum, message] : accum;
        }, [])
        .flat();

    return {
        id: context.store.id,
        type: 'error-validation',
        className: 'formv-messages-error-validation',
        fields,
        legacy: context.legacy,
        customMessages: messages,
        validityMessages,
        renderer: context.renderer,
    };
}
