import test from 'ava';
import sinon from 'sinon';
import * as utils from '../utils';

test.beforeEach(t => {
    t.context.spies = {
        setMessages: sinon.spy(),
        onSubmit: sinon.spy(),
        onInvalid: sinon.spy(),
        setDisabled: sinon.spy(),
        setHighest: sinon.spy(),
    };

    t.context.initialiseForm = () => {
        const formElement = { current: document.createElement('form') };
        const inputElement = document.createElement('input');
        inputElement.name = 'first';
        inputElement.required = true;
        formElement.current.appendChild(inputElement);
        return [formElement, inputElement];
    };
});

test('It should be able to handle purely front-end validation when not passing;', async t => {
    const event = { preventDefault: sinon.spy() };
    const [formElement] = t.context.initialiseForm();

    const onSubmit = utils.handleValidation({
        ...t.context.spies,
        formElement,
    });

    await onSubmit(event);
    t.is(event.preventDefault.callCount, 1);
    t.is(t.context.spies.setMessages.callCount, 2);
    t.is(t.context.spies.setDisabled.callCount, 2);
    t.is(t.context.spies.onInvalid.callCount, 0);
    t.true(t.context.spies.setMessages.calledWith({}));
    t.true(
        t.context.spies.setMessages.calledWith({
            first: 'Constraints not satisfied',
        }),
    );
});

test('It should be able to handle purely front-end validation when passing;', async t => {
    const event = { preventDefault: sinon.spy() };
    const [formElement, inputElement] = t.context.initialiseForm();

    const onSubmit = utils.handleValidation({
        ...t.context.spies,
        formElement,
    });

    inputElement.value = 'Maria';
    await onSubmit(event);
    t.is(event.preventDefault.callCount, 1);
    t.is(t.context.spies.setMessages.callCount, 1);
    t.is(t.context.spies.setDisabled.callCount, 2);
    t.is(t.context.spies.onInvalid.callCount, 0);
    t.true(t.context.spies.setMessages.calledWith({}));
});

test('It should be able to handle purely back-end validation when failing;', async t => {
    const event = { preventDefault: sinon.spy() };
    const [formElement, inputElement] = t.context.initialiseForm();

    {
        const onSubmit = utils.handleValidation({
            ...t.context.spies,
            formElement,
            onSubmit: () => {
                throw new utils.ValidationError({
                    first: ['Constraints not satisfied'],
                });
            },
        });
        inputElement.value = 'Adam';
        await onSubmit(event);
        t.is(event.preventDefault.callCount, 1);
        t.is(t.context.spies.setMessages.callCount, 2);
        t.is(t.context.spies.setDisabled.callCount, 2);
        t.is(t.context.spies.onInvalid.callCount, 1);
        t.true(
            t.context.spies.setMessages.calledWith({
                first: ['Constraints not satisfied'],
            }),
        );
    }
});

test('It should be able to find the encapsulated field otherwise yield `null`;', t => {
    const formElement = { current: document.createElement('form') };
    const fieldElement = { current: document.createElement('div') };
    formElement.current.appendChild(fieldElement.current);
    t.is(utils.getEncapsulatedField(formElement, fieldElement), null);

    const inputElement = document.createElement('input');
    inputElement.name = 'test';
    fieldElement.current.appendChild(inputElement);
    t.is(utils.getEncapsulatedField(formElement, fieldElement), inputElement);
});

test('It should be able to extract the validation messages from the input fields;', t => {
    const elements = [
        { name: 'first', validationMessage: 'Adam' },
        { name: 'second', validationMessage: 'Maria' },
    ];
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
    const formElement = { current: document.createElement('form') };

    const firstNameElement = { current: document.createElement('input') };
    firstNameElement.current.name = 'firstName';
    formElement.current.appendChild(firstNameElement.current);

    const lastNameElement = { current: document.createElement('input') };
    lastNameElement.current.name = 'lastName';
    formElement.current.appendChild(lastNameElement.current);

    const emailAddressElement = { current: document.createElement('input') };
    emailAddressElement.current.name = 'emailAddress';
    formElement.current.appendChild(emailAddressElement.current);

    const errors = {
        firstName: 'required',
        emailAddress: 'required',
    };

    t.deepEqual(utils.invalidElementsFromAPI(formElement, errors), [
        firstNameElement.current,
        emailAddressElement.current,
    ]);
});
