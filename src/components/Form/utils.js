import * as feedback from '../../utils/feedback';

export async function submitForm({ button, event, ...props }) {
    // Clone the form in its current state, because if fields are disabled when submitting then
    // the validity will pass because they are not considered part of the form.
    const form = { current: props.form.current.cloneNode(true) };

    // Obtain the form data as it was submitting.
    const data = getFormData(form.current);

    // Also yield a function that will allow us to grab the actual input field from the clone.
    const getField = fromClone(props.form.current);

    // Determine if the form requires validation based on the `formnovalidate` field.
    const requiresValidation = !button.current || !button.current.hasAttribute('formnovalidate');

    try {
        // Invoke the `onSubmitting` callback so the user can handle the form state
        // change, and have an opportunity to raise early generic and/or validation
        // errors.
        await props.onSubmitting(event);

        // Check to see whether the validation passes the native validation, and if not
        // throw an empty validation error to collect the error messages directly from
        // each of the fields.
        if (requiresValidation && !form.current.checkValidity())
            throw new feedback.FormvValidationError({});

        // Finally invoked the `onSubmitted` event after passing the client-side validation. If this
        // invocation doesn't throw any errors, then we'll consider the submission a success.
        const result = await props.onSubmitted(event);
        const success = result instanceof feedback.FormvSuccess ? result.message : null;

        return {
            isValid: true,
            isDirty: false,
            meta: { fields: [], data, highest: null },
            feedback: { success, errors: [], field: {} },
        };
    } catch (error) {
        // We'll only re-throw errors if they are non-Formv errors.
        if (!isRelatedException(error)) throw error;

        // We always invoke the `onInvalid` callback even if the errors are not necessarily
        // applicable to Formv validation.
        props.onInvalid(event);

        if (error instanceof feedback.FormvGenericError) {
            // Feed any generic API error messages back into the component.
            return {
                isValid: false,
                meta: { fields: [], data: [], highest: null },
                feedback: { success: null, error: [].concat(error.messages).flat(), field: {} },
            };
        }

        if (error instanceof feedback.FormvValidationError) {
            // Feed the API validation errors back into the component.
            const fields = collateInvalidFields(form.current, error.messages);
            const messages = mergeValidationMessages(fields, [props.messages, error.messages]);
            const highest = getHighestFieldset(fields.map(getField), props.id);

            return {
                isValid: false,
                meta: { fields: fields.map(getField), data: [], highest },
                feedback: { success: null, errors: null, field: messages },
            };
        }
    }
}

export function fromClone(form) {
    return (field) => [...form.elements].find(({ name }) => field.name === name);
}

export function isFunction(x) {
    return typeof x === 'function';
}

export function isSubmitButton(element) {
    const name = element.nodeName.toLowerCase();
    const type = element.getAttribute('type');

    if (name === 'input' && type === 'submit') return true;
    if (name === 'button' && (type === 'submit' || type === null)) return true;
    return false;
}

export function isRelatedException(error) {
    return (
        error instanceof feedback.FormvGenericError ||
        error instanceof feedback.FormvValidationError
    );
}

export function collateInvalidFields(form, messages = {}) {
    const keys = Object.keys(messages);

    return [...form.elements].filter(
        (element) => !element.validity.valid || keys.includes(element.name),
    );
}

export function mergeValidationMessages(fields, [customMessages = {}, exceptionMessages = {}]) {
    return fields.reduce((messages, field) => {
        const { name } = field;
        const key = getValidationKey(field);

        const feedback = {
            custom: customMessages[name]
                ? customMessages[name][key] || field.validationMessage
                : field.validationMessage,
            exception: exceptionMessages[name] || [],
        };

        return {
            ...messages,
            [name]: [...[].concat(feedback.custom), ...[].concat(feedback.exception)]
                .filter(Boolean)
                .filter(isUnique)
                .flat(),
        };
    }, {});
}

export function getValidationKey(field) {
    for (var key in field.validity) {
        const isInvalid = key !== 'valid' && field.validity[key];
        if (isInvalid) return key;
    }
}

export function isUnique(value, index, list) {
    return list.indexOf(value) === index;
}

export function getFormData(form) {
    const data = new FormData(form);
    return [...data.keys(), ...data.values()];
}

export function getHighestFieldset(fields, id) {
    const [node] = fields.reduce(
        ([hidhestNode, nodePosition], node) => {
            // Attempt to obtain the fieldset closest to the discovered form field, and ensure
            // if it's not available that the application doesn't panic.
            const fieldset = node.closest(`fieldset[data-id="${id}"]`);
            if (!fieldset) return [hidhestNode, nodePosition];

            // Determine the position of the fieldset in the DOM, and then calculate whether it's
            // positioned higher than the current highest.
            const position = fieldset.getBoundingClientRect();

            return position.top < nodePosition
                ? [fieldset, position.top]
                : [hidhestNode, nodePosition];
        },
        [null, Infinity],
    );

    return node;
}
