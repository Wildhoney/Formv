import test from 'ava';
import * as utils from '../utils';

test.beforeEach(t => {
    const form = document.createElement('form');
    const field = document.createElement('div');
    const input = document.createElement('input');
    form.appendChild(field);
    field.appendChild(input);
    t.context.elements = { form, field, input };
});

test('It should be able to find the contained form element;', t => {
    const { form, field, input } = t.context.elements;

    // Not enough elements supplied.
    t.is(utils.findContainedInput({ current: null }, null), null);
    t.is(utils.findContainedInput({ current: null }, null), null);
    t.is(utils.findContainedInput({ current: null }, input), null);

    // Finally all elements have been supplied so we can find the contained input.
    t.is(utils.findContainedInput({ current: form }, field), input);
});

test('It should be able to map custom messages to native validation rules;', t => {
    const { input } = t.context.elements;
    const customMessages = {
        valueMissing: 'Please fill this field with something.',
    };
    const messages = ['Please fill in the value.'];

    // Input is valid and so messages are yielded straight back.
    t.deepEqual(
        utils.mapCustomMessages(input, customMessages, messages),
        messages,
    );

    // No message and so messages again is yielded immediately back.
    input.required = true;
    t.deepEqual(utils.mapCustomMessages(input, customMessages, []), []);

    // Input has not been supplied so messages is given back yet again.
    t.deepEqual(
        utils.mapCustomMessages(null, customMessages, messages),
        messages,
    );

    // Finally the custom messages are applicable as the input is invalid.
    t.deepEqual(utils.mapCustomMessages(input, customMessages, messages), [
        'Please fill this field with something.',
    ]);

    // No custom messages for the `minLength` prop.
    input.minLength = 5;
    input.value = 'Hello Adam!';
    t.deepEqual(
        utils.mapCustomMessages(input, customMessages, messages),
        messages,
    );
});

test(`It should be able to invalidate the input when it's considered invalid;`, t => {
    const { input, field } = t.context.elements;
    const messages = ['Please fill in the value.'];
    const context = { noScroll: false, highestElement: null };

    // Class name removed as no validation messages.
    input.classList.add('invalid');
    utils.applyInputClassNames(input, [], context, field);
    t.false(input.classList.contains('invalid'));

    // Class name retained as contains invalidation messages.
    input.classList.add('invalid');
    utils.applyInputClassNames(input, messages, context, field);
    t.true(input.classList.contains('invalid'));
});
