export function getClassNames({ values, className }) {
    const typeClassName = className ? `formv-messages-${className}` : false;
    const countClassName = `formv-messages-${
        values.length > 1 ? 'multiple' : 'single'
    }`;
    return ['formv-messages', typeClassName, countClassName]
        .filter(Boolean)
        .join(' ')
        .trim();
}
