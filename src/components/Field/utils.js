import { useCallback } from 'react';

export function isBefore(x) {
    return x === 'before';
}

export function isAfter(x) {
    return x === 'after';
}

export function handleField({ form, setContainer, setField }) {
    return useCallback(
        container => (
            setContainer(container), setField(locateField(form, container))
        ),
        [form, setField],
    );
}

export function handleScroll({ store, container, noScroll }) {
    if (!container || !store.scrollField) return;
    container.contains(store.scrollField) &&
        !noScroll &&
        container.firstChild.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
}

export function locateField(form, field) {
    if (!form || !field) return null;
    return [...form.elements].find(element => field.contains(element)) || null;
}
