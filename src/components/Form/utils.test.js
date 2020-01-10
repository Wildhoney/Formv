import test from 'ava';
import * as utils from './utils';
import { Error } from '../../';

test('It should be able to determine if the exception is related;', t => {
    const syntaxError = new SyntaxError();
    const genericError = new Error.Generic();
    const validationError = new Error.Validation();

    t.false(utils.isRelatedException(syntaxError));
    t.true(utils.isRelatedException(genericError));
    t.true(utils.isRelatedException(validationError));
});

test('It should be able to determine if a button is a form submit button;', t => {
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

test('It should be able to yield a collection of the invalid form fields;', t => {
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
        utils.collateInvalidFields(
            { current: form },
            {
                first: 'invalid',
                third: 'invalid',
            },
        ),
        [first, third],
    );
});
