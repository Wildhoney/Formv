import * as feedback from '../../utils/feedback';

export async function submitForm({ button, event, ...args }) {
    const form = { current: args.form.current.cloneNode(true) };
    form.current.querySelector('fieldset').removeAttribute('disabled');

    const active =
        (document.activeElement &&
            document.activeElement.form === args.form.current &&
            document.activeElement) ||
        null;

    const data = getFormData(form.current);

    // Remove the invalid class name from the form.
    args.form.current && form.current.classList.remove('invalid');

    // Remove the invalid class name from all form fields.
    [...form.current.elements].forEach(
        (field) => field && getFieldFromClone(args.form.current, field).classList.remove('invalid'),
    );

    // Determine if the form requires validation based on the `formnovalidate` field.
    const requiresValidation = !button.current || !button.current.hasAttribute('formnovalidate');

    try {
        // Invoke the `onSubmitting` callback so the user can handle the form state
        // change, and have an opportunity to raise early generic and/or validation
        // errors.
        await args.onSubmitting(event);

        // Check to see whether the validation passes the native validation, and if not
        // throw an empty validation error to collect the error messages directly from
        // each of the fields.
        if (requiresValidation && !form.current.checkValidity())
            throw new feedback.FormvValidationError({});

        // Finally invoked the `onSubmitted` event after passing the client-side validation. If this
        // invocation doesn't throw any errors, then we'll consider the submission a success.
        const result = await args.onSubmitted(event);

        return {
            isValid: true,
            isDirty: false,
            meta: { fields: [], data, highest: null, active },
            feedback: {
                success: result instanceof feedback.FormvSuccess ? result.message : null,
                errors: [],
                field: {},
            },
        };
    } catch (error) {
        // We'll only re-throw errors if they are non-Formv errors.
        if (!isRelatedException(error)) throw error;

        // We always invoke the `onInvalid` callback even if the errors are not necessarily
        // applicable to Formv validation.
        args.onInvalid(event);

        if (error instanceof feedback.FormvGenericError) {
            args.form.current && args.form.current.classList.add('invalid');

            // Feed any generic API error messages back into the component.
            return {
                isValid: false,
                meta: { fields: [], data: [], highest: null, active },
                feedback: {
                    success: null,
                    error: [].concat(error.messages).flat(),
                    field: {},
                },
            };
        }

        if (error instanceof feedback.FormvValidationError) {
            // Feed the API validation errors back into the component.
            const fields = collateInvalidFields(form.current, error.messages);
            const messages = mergeValidationMessages(fields, [args.messages, error.messages]);
            const highest = getHighestField(
                args.form.current,
                fields.map((field) => getFieldFromClone(args.form.current, field)),
            );

            args.form.current && args.form.current.classList.add('invalid');

            fields.forEach((field) => {
                // Apply the invalid class name to each invalid field.
                field && getFieldFromClone(args.form.current, field).classList.add('invalid');
            });

            return {
                isValid: false,
                meta: { fields, data: [], highest, active },
                feedback: {
                    success: null,
                    errors: null,
                    field: messages,
                },
            };
        }
    }
}

export function getFieldFromClone(form, field) {
    return [...form.elements].find(({ name }) => field.name === name);
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

export function getHighestField(form, fields) {
    const [node] = fields.reduce(
        ([hidhestNode, nodePosition], node) => {
            const position = node.getBoundingClientRect();
            const isFieldsetDescendant = node === form.firstChild;
            return position.top < nodePosition && !isFieldsetDescendant
                ? [node, position.top]
                : [hidhestNode, nodePosition];
        },
        [null, Infinity],
    );

    return node;
}
