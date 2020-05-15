import test from 'ava';
import { initialState, reducer, actions } from '../';

test.beforeEach((t) => {
    const form = document.createElement('form');
    const field = document.createElement('input');
    field.setAttribute('value', 'Imogen!');
    field.setAttribute('name', 'field');

    form.append(field);

    t.context.field = field;
    t.context.form = { current: form };
});

function getState(state) {
    return { ...state, meta: { ...state.meta, id: 'abc' } };
}

test('It should be able to handle the form state for initialise;', (t) => {
    const state = reducer(initialState, actions.initialise(t.context.form));
    t.snapshot(getState(state));
});

test('It should be able to yield the current state if action is not handled;', (t) => {
    const state = reducer(initialState, { type: null });
    t.snapshot(getState(state));
});

test('It should be able to handle the form state for dirty check;', (t) => {
    const state = reducer(initialState, actions.dirtyCheck(t.context.form, ['field', 'Imogen!']));
    t.snapshot(getState(state));

    {
        const state = reducer(
            initialState,
            actions.dirtyCheck(t.context.form, ['field', 'Maria!']),
        );
        t.snapshot(getState(state));
    }
});

test('It should be able to handle the form state for reset;', (t) => {
    const state = reducer(initialState, actions.reset(t.context.form));
    t.snapshot(getState(state));
});

test('It should be able to handle the form state for submitting;', (t) => {
    const state = reducer(initialState, actions.submitting());
    t.snapshot(getState(state));
});

test('It should be able to handle the form state for submitted when successful;', (t) => {
    const state = reducer(
        initialState,
        actions.submitted({
            isValid: true,
            isDirty: false,
            meta: { fields: [], data: ['field', 'Imogen!'], highest: null },
            feedback: { success: 'Hello Imogen!', errors: [], field: {} },
        }),
    );
    t.snapshot(getState(state));
});

test('It should be able to handle the form state for submitted when validation fails;', (t) => {
    const state = reducer(
        initialState,
        actions.submitted({
            isValid: false,
            meta: { fields: [t.context.field], data: null, highest: t.context.field },
            feedback: {
                success: null,
                errors: null,
                field: { field: ['Please fill in the one and only field!'] },
            },
        }),
    );
    t.snapshot(getState(state));
});

test('It should be able to handle the form state for submitted when a generic error throws;', (t) => {
    const state = reducer(
        initialState,
        actions.submitted({
            isValid: false,
            meta: { fields: [], data: null, highest: null },
            feedback: {
                success: null,
                error: ['Unable to continue for some reason or another.'],
                field: {},
            },
        }),
    );
    t.snapshot(getState(state));
});
