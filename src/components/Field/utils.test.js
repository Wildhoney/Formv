import test from 'ava';
import * as utils from './utils';

test('It should be able to determine if messages should appear before or after;', t => {
    t.true(utils.isBefore('before'));
    t.false(utils.isBefore('after'));

    t.true(utils.isAfter('after'));
    t.false(utils.isAfter('before'));
});

test('It should be able to locate the input within the given field;', t => {
    const form = document.createElement('form');
    const first = {
        field: document.createElement('div'),
        input: document.createElement('input'),
    };
    const second = {
        field: document.createElement('div'),
        input: document.createElement('input'),
    };

    first.field.append(first.input);
    second.field.append(second.input);

    form.append(first.field);
    form.append(second.field);

    t.deepEqual(utils.locateFields(form, first.field), [first.input]);
    t.deepEqual(utils.locateFields(form, second.field), [second.input]);

    first.field.append(second.input);
    t.deepEqual(utils.locateFields(form, first.field), [first.input, second.input]);
    t.deepEqual(utils.locateFields(form, second.field), []);
});
