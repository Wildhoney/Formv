import { useCallback } from 'react';
import { getMessages } from '../Messages/utils';

export { getStyles } from '../Form/utils';

export function isBefore(x) {
    return x === 'before';
}

export function isAfter(x) {
    return x === 'after';
}

export function handleField({ form, field, messages, setContainer, setField }) {
    return useCallback(
        container => {
            setContainer(container);
            setField(locateField(form, container));

            field &&
                field.addEventListener('invalid', ({ target }) => {
                    target.setCustomValidity(getMessages(field, messages)[0]);
                });
        },
        [form, field, setField],
    );
}

export function handleScroll({ store, container, noScroll }) {
    if (!container || !store.scrollField) return;
    container.contains(store.scrollField) &&
        !noScroll &&
        setTimeout(() => container.firstChild.scrollIntoView({ block: 'start' }));
}

export function locateField(form, field) {
    if (!form || !field) return null;
    return [...form.elements].find(element => field.contains(element)) || null;
}
