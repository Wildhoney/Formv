import test from 'ava';
import * as utils from './utils';

test('It should be able to obtain the messages for the input fields;', t => {
    const first = document.createElement('input');
    first.required = true;
    t.deepEqual(utils.getMessages([first], {}), ['Constraints not satisfied']);

    const second = document.createElement('input');
    second.required = true;
    t.deepEqual(utils.getMessages([second], { valueMissing: 'Please fill in this field' }), [
        'Please fill in this field',
    ]);

    // Only uniques should appear in the output messages.
    t.deepEqual(utils.getMessages([first, second], { valueMissing: 'Please fill in this field' }), [
        'Please fill in this field',
    ]);
});
