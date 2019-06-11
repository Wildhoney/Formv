import test from 'ava';
import sinon from 'sinon';
import * as utils from '../utils';

test.beforeEach(t => {
    t.context.spies = {
        setGenericMessages: sinon.spy(),
        setValidityMessages: sinon.spy(),
        onSubmit: sinon.spy(),
        onInvalid: sinon.spy(),
        setDisabled: sinon.spy(),
        setHighest: sinon.spy(),
    };

    t.context.initialiseForm = () => {
        const form = document.createElement('form');
        const input = document.createElement('input');
        input.name = 'first';
        input.required = true;
        form.appendChild(input);
        return [form, input];
    };
});

test('It should be able to handle purely front-end validation when not passing;', async t => {
    const event = { preventDefault: sinon.spy() };
    const [form] = t.context.initialiseForm();

    const onSubmit = utils.handleValidation({
        ...t.context.spies,
        form,
    });

    await onSubmit(event);
    t.is(event.preventDefault.callCount, 1);
    t.is(t.context.spies.setValidityMessages.callCount, 2);
    t.is(t.context.spies.setDisabled.callCount, 2);
    t.is(t.context.spies.onInvalid.callCount, 0);
    t.true(t.context.spies.setValidityMessages.calledWith({}));
    t.true(
        t.context.spies.setValidityMessages.calledWith({
            first: 'Constraints not satisfied',
        }),
    );
});

test('It should be able to handle purely front-end validation when passing;', async t => {
    const event = { preventDefault: sinon.spy() };
    const [form, input] = t.context.initialiseForm();

    const onSubmit = utils.handleValidation({
        ...t.context.spies,
        form,
    });

    input.value = 'Maria';
    await onSubmit(event);
    t.is(event.preventDefault.callCount, 1);
    t.is(t.context.spies.setValidityMessages.callCount, 1);
    t.is(t.context.spies.setDisabled.callCount, 2);
    t.is(t.context.spies.onInvalid.callCount, 0);
    t.true(t.context.spies.setValidityMessages.calledWith({}));
});

test('It should be able to handle purely back-end validation when failing;', async t => {
    const event = { preventDefault: sinon.spy() };
    const [form, input] = t.context.initialiseForm();

    {
        const onSubmit = utils.handleValidation({
            ...t.context.spies,
            form,
            onSubmit: () => {
                throw new utils.ValidationError({
                    first: ['Constraints not satisfied'],
                });
            },
        });

        input.value = 'Adam';
        await onSubmit(event);

        t.is(event.preventDefault.callCount, 1);
        t.is(t.context.spies.setValidityMessages.callCount, 2);
        t.is(t.context.spies.setDisabled.callCount, 2);
        t.is(t.context.spies.onInvalid.callCount, 1);
        t.true(
            t.context.spies.setValidityMessages.calledWith({
                first: ['Constraints not satisfied'],
            }),
        );
    }
});

test('It should be able to handle purely back-end errors when failing;', async t => {
    const event = { preventDefault: sinon.spy() };
    const [form, input] = t.context.initialiseForm();

    {
        const onSubmit = utils.handleValidation({
            ...t.context.spies,
            form,
            onSubmit: () => {
                throw new utils.GenericError(['Constraints not satisfied']);
            },
        });

        input.value = 'Adam';
        await onSubmit(event);

        t.is(event.preventDefault.callCount, 1);
        t.is(t.context.spies.setGenericMessages.callCount, 2);
        t.is(t.context.spies.setDisabled.callCount, 2);
        t.is(t.context.spies.onInvalid.callCount, 1);
        t.true(t.context.spies.setGenericMessages.calledWith(['Constraints not satisfied']));
    }
});

test('It should be able to find the encapsulated field otherwise yield `null`;', t => {
    const form = document.createElement('form');
    const field = document.createElement('div');
    form.appendChild(field);
    t.is(utils.getEncapsulatedField(form, field), null);

    const input = document.createElement('input');
    input.name = 'test';
    field.appendChild(input);
    t.is(utils.getEncapsulatedField(form, field), input);
});

test('It should be able to extract the validation messages from the input fields;', t => {
    const elements = [{ name: 'first', validationMessage: 'Adam' }, { name: 'second', validationMessage: 'Maria' }];
    t.deepEqual(utils.getValidationMessages(elements), {
        first: 'Adam',
        second: 'Maria',
    });
});

test('It should be able to find the elements which fail the validation tests from the form;', t => {
    const elements = [
        { name: 'first', validity: { valid: false } },
        { validity: { valid: false } },
        { name: 'third', validity: { valid: true } },
    ];
    t.deepEqual(utils.invalidElementsFromForm(elements), [elements[0]]);
});

test('It should be able to find the elements which fail the validation tests from the API;', t => {
    const form = document.createElement('form');

    const firstName = document.createElement('input');
    firstName.name = 'firstName';
    form.appendChild(firstName);

    const lastName = document.createElement('input');
    lastName.name = 'lastName';
    form.appendChild(lastName);

    const emailAddress = document.createElement('input');
    emailAddress.name = 'emailAddress';
    form.appendChild(emailAddress);

    const errors = {
        firstName: 'required',
        emailAddress: 'required',
    };

    t.deepEqual(utils.invalidElementsFromAPI(form, errors), [firstName, emailAddress]);
});

test('It should be able to figure out the element that is highest in the DOM;', t => {
    const form = document.createElement('form');

    const first = document.createElement('input');
    first.name = 'first';
    first.getBoundingClientRect = () => ({ top: 25 });
    form.appendChild(first);

    const second = document.createElement('input');
    second.name = 'second';
    second.getBoundingClientRect = () => ({ top: 5 });
    form.appendChild(second);

    const element = utils.getHighestElement([...form.elements]);
    t.is(element, 'second');
});

test('It should be able to format the message with the passed custom message;', t => {
    const input = document.createElement('input');
    input.name = 'first';
    input.required = true;

    t.deepEqual(utils.formatCustomMessages(input, { valueMissing: 'Where is it?' }, ['required']), ['Where is it?']);
    t.deepEqual(utils.formatCustomMessages(input, { typeMismatch: 'Why does it not mtch?' }, ['required']), [
        'required',
    ]);

    input.value = 'Hello Maria!';
    t.deepEqual(utils.formatCustomMessages(input, { valueMissing: 'Where is it?' }, ['required']), ['required']);
});
