export function getClassNames({ values, className }) {
    const typeClassName = `formv-messages-${className}`;
    const countClassName = `formv-messages-${values.length > 1 ? 'multiple' : 'single'}`;
    return ['formv-messages', typeClassName, countClassName].join(' ').trim();
}
