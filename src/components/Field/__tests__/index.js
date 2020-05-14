import test from 'ava';
import { mount } from 'enzyme';
import React, { useRef } from 'react';
import { useMount } from 'react-use';
import { useTrackedState } from '../../Store';
import Container from '../../Container';
import Field from '../';

test('It should be able to set the data attribute of the unique ID for the highest function to use;', (t) => {
    t.plan(1);

    function Example() {
        const ref = useRef();
        const state = useTrackedState();

        useMount(() => t.is(ref.current.dataset.id, state.meta.id));

        return (
            <Field ref={ref}>
                <input type="text" />
            </Field>
        );
    }

    mount(
        <Container withDirtyCheck>
            <Example />
        </Container>,
    );
});
