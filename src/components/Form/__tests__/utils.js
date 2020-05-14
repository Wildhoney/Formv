import test from 'ava';
import sinon from 'sinon';
import { Error } from '../../../';
import { FormvSuccess, FormvValidationError } from '../../../utils/feedback';
import * as utils from '../utils';

test('It should be able to determine if a button is a form submit button;', (t) => {
    t.false(utils.isSubmitButton(document.createElement('div')));

    const input = document.createElement('input');
    t.false(utils.isSubmitButton(input));
    input.setAttribute('type', 'submit');
    t.true(utils.isSubmitButton(input));

    const button = document.createElement('button');
    button.setAttribute('type', 'reset');
    t.false(utils.isSubmitButton(button));
    button.removeAttribute('type');
    t.true(utils.isSubmitButton(button));
    button.setAttribute('type', 'submit');
    t.true(utils.isSubmitButton(button));
});

test('It should be able to determine if the exception is related;', (t) => {
    const syntaxError = new SyntaxError();
    const genericError = new Error.Generic();
    const validationError = new Error.Validation();

    t.false(utils.isRelatedException(syntaxError));
    t.true(utils.isRelatedException(genericError));
    t.true(utils.isRelatedException(validationError));
});

test('It should be able to yield a collection of the invalid form fields;', (t) => {
    const form = document.createElement('form');
    const first = document.createElement('input');
    const second = document.createElement('input');
    const third = document.createElement('input');

    first.setAttribute('name', 'first');
    second.setAttribute('name', 'second');
    third.setAttribute('name', 'third');

    form.append(first);
    form.append(second);
    form.append(third);

    t.deepEqual(
        utils.collateInvalidFields(form, {
            first: 'invalid',
            third: 'invalid',
        }),
        [first, third],
    );
});

test('It should be able to retrieve the actual form field from the cloned form field;', (t) => {
    const form = document.createElement('form');
    const field = document.createElement('input');
    field.setAttribute('name', 'example');
    form.append(field);

    const clonedForm = form.cloneNode(true);
    const clonedField = clonedForm.querySelector('input');
    const getField = utils.fromClone(form);

    t.is(getField(clonedField), field);
});

test('It should be able to determine when the passed type is a function;', (t) => {
    const a = () => {};
    const b = 'x';
    const c = {};

    t.true(utils.isFunction(a));
    t.false(utils.isFunction(b));
    t.false(utils.isFunction(c));
});

test('It should be able to merge all of the validation messages togther;', (t) => {
    const form = document.createElement('form');
    const first = document.createElement('input');
    const second = document.createElement('input');
    const third = document.createElement('input');
    const fourth = document.createElement('input');

    first.setAttribute('name', 'first');
    second.setAttribute('name', 'second');
    third.setAttribute('name', 'third');
    fourth.setAttribute('name', 'fourth');

    first.setAttribute('required', '');
    second.setAttribute('required', '');
    third.setAttribute('required', '');
    fourth.setAttribute('required', '');

    form.append(first);
    form.append(second);
    form.append(third);
    form.append(fourth);

    const messages = utils.mergeValidationMessages(
        [...form.elements],
        [
            {
                first: {
                    valueMissing: 'Bots are not allowed to post messages.',
                },
                third: {
                    valueMissing: [
                        'Bots are still not allowed to post messages.',
                        'We are entirely certain that bots cannot post messages!',
                    ],
                },
            },
            {
                second: 'Please enter your name, sunshine!',
            },
        ],
    );

    t.snapshot(messages);
});

test('It should be able to determine the key that failed validation;', (t) => {
    const field = document.createElement('input');
    field.setAttribute('name', 'first');
    field.setAttribute('required', '');

    t.is(utils.getValidationKey(field), 'valueMissing');
});

test('It should be able to map over any given items and remove duplicates;', (t) => {
    const xs = [1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 9, 9, 10];
    t.deepEqual(xs.filter(utils.isUnique), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('It should be able to obtain an array of the form data for dirty comparisons', (t) => {
    const form = document.createElement('form');
    const first = document.createElement('input');
    const second = document.createElement('input');
    const third = document.createElement('input');

    first.setAttribute('name', 'name');
    second.setAttribute('name', 'email');
    third.setAttribute('name', 'location');

    first.setAttribute('value', 'Adam');
    second.setAttribute('value', 'adam.timberlake@gmail.com');
    third.setAttribute('value', 'Watford, UK');

    form.append(first);
    form.append(second);
    form.append(third);

    t.deepEqual(utils.getFormData(form), [
        'name',
        'email',
        'location',
        'Adam',
        'adam.timberlake@gmail.com',
        'Watford, UK',
    ]);
});

test('It should be able to determine the highest fieldset in the form is;', (t) => {
    const fields = [
        document.createElement('input'),
        document.createElement('input'),
        document.createElement('input'),
    ];

    const fieldsets = [
        document.createElement('fieldset'),
        document.createElement('fieldset'),
        document.createElement('fieldset'),
    ];

    fieldsets.forEach((fieldset, index) => {
        fieldset.append(fields[index]);
        fieldset.setAttribute('data-id', 'abc');
    });

    fieldsets[0].getBoundingClientRect = () => ({ top: 55 });
    fieldsets[1].getBoundingClientRect = () => ({ top: 25 });
    fieldsets[2].getBoundingClientRect = () => ({ top: 165 });

    t.is(utils.getHighestFieldset(fields, 'abc'), fieldsets[1]);
    t.is(utils.getHighestFieldset(fields, 'abcdef'), null);
});

test('It should be able to handle successful form submissions;', async (t) => {
    const spies = {
        onSubmitting: sinon.spy(),
        onSubmitted: sinon.spy(() => new FormvSuccess('Congrats!')),
        onInvalid: sinon.spy(),
    };

    const form = document.createElement('form');
    const first = document.createElement('input');
    const second = document.createElement('input');
    const third = document.createElement('input');

    first.setAttribute('name', 'name');
    second.setAttribute('name', 'email');
    third.setAttribute('name', 'location');

    first.setAttribute('value', 'Adam');
    second.setAttribute('value', 'adam.timberlake@gmail.com');
    third.setAttribute('value', 'Watford, UK');

    form.append(first);
    form.append(second);
    form.append(third);

    const result = await utils.submitForm({
        form: { current: form },
        button: { current: null },
        messages: {},
        event: {},
        id: 'abc',
        onInvalid: spies.onInvalid,
        onSubmitting: spies.onSubmitting,
        onSubmitted: spies.onSubmitted,
    });

    t.is(spies.onSubmitting.callCount, 1);
    t.is(spies.onSubmitted.callCount, 1);
    t.is(spies.onInvalid.callCount, 0);

    t.deepEqual(result, {
        isValid: true,
        isDirty: false,
        meta: {
            fields: [],
            data: ['name', 'email', 'location', 'Adam', 'adam.timberlake@gmail.com', 'Watford, UK'],
            highest: null,
        },
        feedback: { success: 'Congrats!', errors: [], field: {} },
    });
});

test('It should be able to skip the validation if the button has "formnovalidate";', async (t) => {
    const spies = {
        onSubmitting: sinon.spy(),
        onSubmitted: sinon.spy(),
        onInvalid: sinon.spy(),
    };

    const form = document.createElement('form');
    const field = document.createElement('input');
    const button = document.createElement('button');

    field.setAttribute('name', 'name');
    field.setAttribute('value', '');
    field.setAttribute('required', '');
    button.setAttribute('formnovalidate', '');
    form.append(field);
    form.append(button);

    const result = await utils.submitForm({
        form: { current: form },
        button: { current: button },
        messages: {},
        event: {},
        id: 'abc',
        onSubmitting: spies.onSubmitting,
        onSubmitted: spies.onSubmitted,
        onInvalid: spies.onInvalid,
    });

    t.is(spies.onSubmitting.callCount, 1);
    t.is(spies.onSubmitted.callCount, 1);
    t.is(spies.onInvalid.callCount, 0);

    t.deepEqual(result, {
        isValid: true,
        isDirty: false,
        meta: {
            fields: [],
            data: ['name', ''],
            highest: null,
        },
        feedback: { success: null, errors: [], field: {} },
    });
});

test('It should be able to throw validation errors if the validation fails;', async (t) => {
    const spies = {
        onSubmitting: sinon.spy(),
        onSubmitted: sinon.spy(),
        onInvalid: sinon.spy(),
    };

    const form = document.createElement('form');
    const field = document.createElement('input');

    field.setAttribute('name', 'name');
    field.setAttribute('value', '');
    field.setAttribute('required', '');
    form.append(field);

    const result = await utils.submitForm({
        form: { current: form },
        button: { current: null },
        messages: {},
        event: {},
        id: 'abc',
        onSubmitting: spies.onSubmitting,
        onSubmitted: spies.onSubmitted,
        onInvalid: spies.onInvalid,
    });

    t.is(spies.onSubmitting.callCount, 1);
    t.is(spies.onSubmitted.callCount, 0);
    t.is(spies.onInvalid.callCount, 1);

    t.deepEqual(result, {
        feedback: {
            errors: null,
            field: {
                name: ['Constraints not satisfied'],
            },
            success: null,
        },
        isValid: false,
        meta: {
            data: null,
            fields: [field],
            highest: null,
        },
    });
});

test('It should be able to throw validation errors if the API fails;', async (t) => {
    const spies = {
        onSubmitting: sinon.spy(),
        onSubmitted: sinon.spy(() => {
            throw new FormvValidationError({
                name: 'Bots are definitely not allowed to be posting.',
            });
        }),
        onInvalid: sinon.spy(),
    };

    const form = document.createElement('form');
    const field = document.createElement('input');

    field.setAttribute('name', 'name');
    field.setAttribute('value', 'Bot!');
    field.setAttribute('required', '');
    form.append(field);

    const result = await utils.submitForm({
        form: { current: form },
        button: { current: null },
        messages: {},
        event: {},
        id: 'abc',
        onSubmitting: spies.onSubmitting,
        onSubmitted: spies.onSubmitted,
        onInvalid: spies.onInvalid,
    });

    t.is(spies.onSubmitting.callCount, 1);
    t.is(spies.onSubmitted.callCount, 1);
    t.is(spies.onInvalid.callCount, 1);

    t.deepEqual(result, {
        feedback: {
            errors: null,
            field: {
                name: ['Bots are definitely not allowed to be posting.'],
            },
            success: null,
        },
        isValid: false,
        meta: {
            data: null,
            fields: [field],
            highest: null,
        },
    });
});

test('It should be able to re-throw errors that are not related to Formv;', async (t) => {
    const spies = {
        onSubmitting: sinon.spy(() => {
            throw new global.Error('Uh oh!');
        }),
        onSubmitted: sinon.spy(),
        onInvalid: sinon.spy(),
    };

    const form = document.createElement('form');
    const field = document.createElement('input');

    field.setAttribute('name', 'name');
    field.setAttribute('value', 'Adam');
    field.setAttribute('required', '');
    form.append(field);

    await t.throwsAsync(
        async () =>
            utils.submitForm({
                form: { current: form },
                button: { current: null },
                messages: {},
                event: {},
                id: 'abc',
                onSubmitting: spies.onSubmitting,
                onSubmitted: spies.onSubmitted,
                onInvalid: spies.onInvalid,
            }),
        { instanceOf: global.Error, message: 'Uh oh!' },
    );

    t.is(spies.onSubmitting.callCount, 1);
    t.is(spies.onSubmitted.callCount, 0);
    t.is(spies.onInvalid.callCount, 0);
});
