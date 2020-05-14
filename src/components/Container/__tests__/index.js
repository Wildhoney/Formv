import test from 'ava';
import { mount } from 'enzyme';
import React from 'react';
import { useTrackedState } from '../../Store';
import Container from '../';

test('It should be able to set the default value of dirty check if enabled;', (t) => {
    t.plan(2);

    function Example() {
        const state = useTrackedState();
        t.false(state.isDirty);
        return null;
    }

    mount(
        <Container withDirtyCheck>
            <Example />
        </Container>,
    );
});

test('It should be able to set the default value of dirty check if disabled;', (t) => {
    t.plan(2);

    function Example() {
        const state = useTrackedState();
        t.is(state.isDirty, null);
        return null;
    }

    mount(
        <Container withDirtyCheck={false}>
            <Example />
        </Container>,
    );
});
