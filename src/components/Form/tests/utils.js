import test from 'ava';
import delay from 'delay';
import sinon from 'sinon';
import * as utils from '../utils';

test.beforeEach(t => {
    const form = document.createElement('form');
    const field = document.createElement('div');
    const input = document.createElement('input');
    const button = document.createElement('button');
    form.appendChild(field);
    field.appendChild(input);
    form.appendChild(button);
    t.context.elements = { form, field, input, button };
});

test('It should be able to handle the form submission process;', async t => {
    const { form, input, button } = t.context.elements;
    form.checkValidity = sinon.spy(form.checkValidity);

    const preventDefaultSpy = sinon.spy();
    const actions = {
        dispatch: sinon.spy(),
        onSubmit: sinon.spy(),
        onInvalid: sinon.spy(),
    };

    const handler = utils.handleFormValidation({
        form: { current: form },
        ...actions,
    });
    handler({ preventDefault: preventDefaultSpy });
    await delay(1);

    // These functions should always be called.
    t.is(preventDefaultSpy.callCount, 1);
    t.true(
        actions.dispatch.calledWith({
            type: 'reset',
        }),
    );
    t.true(
        actions.dispatch.calledWith({
            type: 'disabled',
            payload: false,
        }),
    );

    // Form is valid in this instance.
    t.is(form.checkValidity.callCount, 1);
    t.is(actions.onSubmit.callCount, 1);

    // Form invalid because of front-end validation.
    input.name = 'example';
    input.required = true;
    handler({ preventDefault: preventDefaultSpy });
    await delay(1);

    t.is(actions.onSubmit.callCount, 1);
    t.true(
        actions.dispatch.calledWith({
            type: 'messages/validity',
            payload: {
                highest: input,
                messages: { example: 'Constraints not satisfied' },
            },
        }),
    );

    // Explicitly bypassing the validation from the button.
    button.setAttribute('formnovalidate', '');
    handler({ preventDefault: preventDefaultSpy });
    await delay(1);
    t.is(form.checkValidity.callCount, 2);
    t.is(actions.onSubmit.callCount, 2);
    button.removeAttribute('formnovalidate');

    {
        // Fails back-end validation because we're now throwing the ValidationError.
        const validationErrorActions = {
            ...actions,
            onSubmit: sinon.spy(() => {
                throw new utils.ValidationError({
                    example: 'Please fill in this field.',
                });
            }),
        };
        const handler = utils.handleFormValidation({
            form: { current: form },
            ...validationErrorActions,
        });
        input.value = 'Hello Maria!';
        handler({ preventDefault: preventDefaultSpy });
        await delay(1);
        t.is(actions.onSubmit.callCount, 2);
        t.is(validationErrorActions.onInvalid.callCount, 1);
        t.true(
            actions.dispatch.calledWith({
                type: 'messages/validity',
                payload: {
                    highest: input,
                    messages: { example: 'Please fill in this field.' },
                },
            }),
        );
    }

    {
        // Back-end validation is now passing but a GenericError is now being thrown instead.
        const genericErrorActions = {
            ...actions,
            onSubmit: sinon.spy(() => {
                throw new utils.GenericError([
                    'Something terribly bad happened.',
                ]);
            }),
        };
        const handler = utils.handleFormValidation({
            form: { current: form },
            ...genericErrorActions,
        });
        handler({ preventDefault: preventDefaultSpy });
        await delay(1);
        t.is(actions.onSubmit.callCount, 2);
        t.is(genericErrorActions.onInvalid.callCount, 2);
        t.true(
            actions.dispatch.calledWith({
                type: 'messages/generic',
                payload: {
                    highest: form,
                    messages: ['Something terribly bad happened.'],
                },
            }),
        );
    }

    {
        // Any other errors from the `onSubmit` handler should be re-thrown.
        const otherErrorActions = {
            ...actions,
            onSubmit: sinon.spy(() => {
                throw new Error('What just happened?');
            }),
        };
        const handler = utils.handleFormValidation({
            form: { current: form },
            ...otherErrorActions,
        });

        const error = await t.throwsAsync(() =>
            handler({ preventDefault: preventDefaultSpy }),
        );
        t.is(error.message, 'What just happened?');
    }
});

test('It should be able to provide an array of `onSubmit` functions for submission;', async t => {
    const { form } = t.context.elements;
    form.checkValidity = sinon.spy(form.checkValidity);

    const preventDefaultSpy = sinon.spy();
    const onSubmittingSpy = sinon.spy();
    const onSubmittedSpy = sinon.spy();
    const actions = {
        dispatch: sinon.spy(),
        onInvalid: sinon.spy(),
    };
    const handler = utils.handleFormValidation({
        form: { current: form },
        ...actions,
        onSubmit: [onSubmittingSpy, onSubmittedSpy],
    });

    handler({ preventDefault: preventDefaultSpy });
    t.is(onSubmittingSpy.callCount, 1);
    await delay(1);
    t.is(onSubmittedSpy.callCount, 1);
});

test('It should be able to construct the class names for the component;', t => {
    t.is(utils.getClassNames(), 'formv');
    t.is(utils.getClassNames('my-form'), 'formv my-form');
});

test('It should be able to handle scrolling when there is a highest element;', async t => {
    const { form, input } = t.context.elements;
    form.scrollIntoView = sinon.spy();
    input.scrollIntoView = sinon.spy();

    // Form reference has not yet been captured
    utils.handleScroll({ current: null }, { highestElement: form }, true);
    await delay(1);
    t.is(form.scrollIntoView.callCount, 0);

    // Scrolling has been disabled by the developer.
    utils.handleScroll({ current: form }, { highestElement: form }, true);
    await delay(1);
    t.is(form.scrollIntoView.callCount, 0);

    // Should now scroll to the element.
    utils.handleScroll({ current: form }, { highestElement: form }, false);
    await delay(1);
    t.is(form.scrollIntoView.callCount, 1);

    // Should now scroll to the input.
    utils.handleScroll({ current: input }, { highestElement: input }, false);
    await delay(1);
    t.is(input.scrollIntoView.callCount, 1);
});

test('It should be able to obtain a list of the invalid elements;', t => {
    const { form } = t.context.elements;
    const name = document.createElement('input');
    const age = document.createElement('input');
    const location = document.createElement('input');

    name.required = true;
    name.name = 'name';

    age.name = 'age';

    location.required = true;
    location.minLength = 5;
    location.value = 'Adam';

    form.appendChild(name);
    form.appendChild(age);
    form.appendChild(location);

    t.deepEqual(utils.getInvalidFormElements(form), [name]);
});

test('It should be able to map messages to invalid elements;', t => {
    const { form } = t.context.elements;
    const name = document.createElement('input');
    const age = document.createElement('input');

    name.required = true;
    name.name = 'name';
    age.name = 'age';

    form.appendChild(name);
    form.appendChild(age);

    t.deepEqual(
        utils.mapInvalidFormElements(form, {
            name: 'Please fill in your name.',
        }),
        [name],
    );
});

test('It should be able to extract the validation messages from the invalid elements;', t => {
    const name = document.createElement('input');
    const age = document.createElement('input');
    name.name = 'name';
    age.name = 'age';
    name.required = true;
    age.required = true;

    t.deepEqual(utils.getValidationMessages([name, age]), {
        name: 'Constraints not satisfied',
        age: 'Constraints not satisfied',
    });
});

test('It should be able to determine which is the highest positioned element in the DOM;', t => {
    const name = document.createElement('input');
    const age = document.createElement('input');
    const location = document.createElement('input');

    name.name = 'name';
    age.name = 'age';
    location.name = 'location';

    name.getBoundingClientRect = () => ({ top: 50 });
    age.getBoundingClientRect = () => ({ top: 5 });
    location.getBoundingClientRect = () => ({ top: 15 });

    t.is(utils.determineHighestElement([name, age, location]), age);
});

test('It should be able to extend the native Error class to create specific error classes;', t => {
    try {
        throw new utils.GenericError(['Please fill in this field.']);
    } catch (error) {
        t.deepEqual(error.messages, ['Please fill in this field.']);
    }

    try {
        throw new utils.ValidationError({ name: 'Please fill in this field.' });
    } catch (error) {
        t.deepEqual(error.messages, { name: 'Please fill in this field.' });
    }
});

test('It should be able to find the first submit button in the form;', t => {
    const { form } = t.context.elements;

    const resetButton = document.createElement('button');
    resetButton.type = 'reset';
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    form.appendChild(resetButton);
    form.appendChild(submitButton);

    t.deepEqual(utils.findSubmitButton({ current: form }), submitButton);
    t.is(
        utils.findSubmitButton({ current: document.createElement('form') }),
        null,
    );
});

test('It should be able to determine when form is validatable;', t => {
    const { form } = t.context.elements;

    const submitButton = document.createElement('button');
    form.appendChild(submitButton);
    t.true(utils.isFormValidatable({ current: form }));

    form.querySelector('button').setAttribute('formnovalidate', '');
    t.false(utils.isFormValidatable({ current: form }));

    submitButton.type = 'submit';
    form.querySelector('button').removeAttribute('formnovalidate');
    t.true(utils.isFormValidatable({ current: form }));
});
