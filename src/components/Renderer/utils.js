export function handleScroll({ successMessage, genericMessages, noScroll }) {
    return node => {
        if (!node) return;
        const container = successMessage ? node.firstChild : node;

        !noScroll &&
            container &&
            (successMessage || genericMessages.length > 0) &&
            setTimeout(() => container.scrollIntoView({ block: 'start' }));
    };
}
