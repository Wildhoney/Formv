import test from 'ava';
import * as duck from '../duck';

test.afterEach(t => {
    const newState = duck.reducer(duck.initialState, {
        type: 'reset',
    });
    t.deepEqual(newState, { ...duck.initialState, isDisabled: true });
});

test('It should be able to change the state to disabled;', t => {
    const newState = duck.reducer(duck.initialState, {
        type: 'disabled',
        payload: true,
    });
    t.deepEqual(newState, { ...duck.initialState, isDisabled: true });

    const newState_ = duck.reducer(newState, {
        type: 'disabled',
        payload: false,
    });
    t.deepEqual(newState_, { ...duck.initialState, isDisabled: false });
    t.context.state = newState_;
});

test('It should be able to set the generic and validity messages with highest element;', t => {
    const element = document.createElement('input');
    const newState = duck.reducer(duck.initialState, {
        type: 'messages/generic',
        payload: {
            highest: element,
            messages: { name: 'Constraints failed' },
        },
    });
    t.deepEqual(newState, {
        ...duck.initialState,
        highestElement: element,
        messages: {
            ...duck.initialState.messages,
            generic: { name: 'Constraints failed' },
        },
    });

    {
        const element = document.createElement('input');
        const newState_ = duck.reducer(duck.initialState, {
            type: 'messages/validity',
            payload: {
                highest: element,
                messages: { name: 'More constraints failed' },
            },
        });
        t.deepEqual(newState_, {
            ...newState,
            highestElement: element,
            messages: {
                ...duck.initialState.messages,
                validity: { name: 'More constraints failed' },
            },
        });

        t.context.state = newState_;
    }
});
