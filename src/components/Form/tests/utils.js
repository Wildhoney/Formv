import test from 'ava';
import delay from 'delay';
import sinon from 'sinon';
import * as utils from '../utils';

test.beforeEach(t => {
    const form = document.createElement('form');
    const field = document.createElement('div');
    const input = document.createElement('input');
    form.appendChild(field);
    field.appendChild(input);
    t.context.elements = { form, field, input };
});

test.todo('It should be able to handle the form submission process;');

test('It should be able to construct the class names for the component;', t => {
    t.is(utils.getClassNames(), 'formv');
    t.is(utils.getClassNames('my-form'), 'formv my-form');
});

test('It should be able to handle scrolling to the form when it is the highest element;', async t => {
    const { form, input } = t.context.elements;
    form.scrollIntoView = sinon.spy();

    // Form reference has not yet been captured
    utils.handleScroll({ current: null }, { highestElement: form }, true);
    await delay(1);
    t.is(form.scrollIntoView.callCount, 0);

    // Scrolling has been disabled by the developer.
    utils.handleScroll({ current: form }, { highestElement: form }, true);
    await delay(1);
    t.is(form.scrollIntoView.callCount, 0);

    // Form is not the highest element.
    utils.handleScroll({ current: form }, { highestElement: input }, false);
    await delay(1);
    t.is(form.scrollIntoView.callCount, 0);

    // Should now scroll to the element.
    utils.handleScroll({ current: form }, { highestElement: form }, false);
    await delay(1);
    t.is(form.scrollIntoView.callCount, 1);
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
