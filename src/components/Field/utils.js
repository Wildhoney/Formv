export function getStyles() {
    return { display: 'contents' };
}

export function getHighestField(fields, isFieldset = false) {
    const [element] = fields.reduce(
        ([highestElement, elementPosition], element) => {
            const position = isFieldset
                ? element.firstChild.getBoundingClientRect()
                : element.getBoundingClientRect();

            return position.top < elementPosition
                ? [element, position.top]
                : [highestElement, elementPosition];
        },
        [null, Infinity],
    );

    return element;
}
