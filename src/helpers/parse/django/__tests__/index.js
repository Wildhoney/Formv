import test from 'ava';
import {
    flattenValidationMessages,
    flattenArrayValidationMessages,
    flattenNestedValidationMessages,
} from '../';

test('It should be able to flatten the array of Django validation messages;', (t) => {
    const validationMessages = {
        name: [{ first: ['required'], last: ['required'] }, { first: ['required'] }],
        age: ['required'],
        location: {
            city: ['required'],
            moved: ['required'],
        },
    };
    t.snapshot(flattenValidationMessages(validationMessages));
    t.snapshot(flattenArrayValidationMessages(validationMessages.name, 'name'));
    t.snapshot(flattenNestedValidationMessages(validationMessages.location, 'location'));
});
