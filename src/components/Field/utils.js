import { useCallback } from 'react';

export function isBefore(x) {
    return x === 'before';
}

export function isAfter(x) {
    return x === 'after';
}

export function handleField({ form, setField }) {
    return useCallback(container => setField(locateField(form, container)), [
        form,
        setField,
    ]);
}

export function locateField(form, field) {
    if (!form || !field) return null;
    return [...form.elements].find(element => field.contains(element)) || null;
}
