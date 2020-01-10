export function getMessages() {
    return {
        name: {
            valueMissing: 'Please enter your first name.',
        },
        email: {
            valueMissing: 'Please enter your email address.',
            typeMismatch: 'Please enter a valid email address.',
        },
        message: {
            valueMissing: 'Please ensure your message is at least 20 characters.',
        },
    };
}
