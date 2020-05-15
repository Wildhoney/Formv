import test from 'ava';
import { mount } from 'enzyme';
import React from 'react';
import PropTypes from 'prop-types';
import useMap from '../useMap';

function Name({ onClick }) {
    return <button onClick={() => onClick('Imogen')} />;
}

Name.propTypes = { onClick: PropTypes.func.isRequired };

function Example() {
    const [state, { set, remove, reset }] = useMap({
        user: {
            firstName: null,
            lastName: 'Timberlake',
        },
        age: 34,
        locations: ['United Kingdom', 'Russian Federation'],
    });

    return (
        <>
            <code>{JSON.stringify(state, null, '\t')}</code>

            <section className="set">
                <button onClick={() => set('user.firstName', 'Imogen')} />
                <button onClick={() => set('user.lastName', 'Nikonova')} />
                <button onClick={() => set('age', 1)} />
                <button onClick={() => set('locations.0', 'UK')} />
                <button onClick={() => set('locations.1', 'RU')} />
            </section>

            <section className="set-with-currying">
                <Name onClick={set('user.firstName')} />
            </section>

            <section className="remove">
                <button onClick={() => remove('user.firstName')} />
                <button onClick={() => remove('user.lastName')} />
                <button onClick={() => remove('user')} />
                <button onClick={() => remove('age')} />
                <button onClick={() => remove('locations.0')} />
                <button onClick={() => remove('locations.1')} />
                <button onClick={() => remove('locations')} />
            </section>

            <section className="reset">
                <button onClick={() => set('user.firstName', 'Imogen')} />
                <button onClick={() => set('user.lastName', 'Nikonova')} />
                <button onClick={reset} />
            </section>
        </>
    );
}

test('It should be able to handle the getting of state;', (t) => {
    const wrapper = mount(<Example />);
    t.snapshot(wrapper.find('code').html());
});

test('It should be able to handle the setting of state;', (t) => {
    const wrapper = mount(<Example />);
    const buttons = wrapper.find('section.set button');

    t.plan(buttons.length);
    buttons.forEach((button) => {
        button.simulate('click');
        t.snapshot(wrapper.find('code').html());
    });
});

test('It should be able to handle the setting of state with currying;', (t) => {
    const wrapper = mount(<Example />);
    const buttons = wrapper.find('section.set-with-currying button');

    t.plan(buttons.length);
    buttons.forEach((button) => {
        button.simulate('click');
        t.snapshot(wrapper.find('code').html());
    });
});

test('It should be able to handle the removing of state;', (t) => {
    const wrapper = mount(<Example />);
    const buttons = wrapper.find('section.remove button');

    t.plan(buttons.length);
    buttons.forEach((button) => {
        button.simulate('click');
        t.snapshot(wrapper.find('code').html());
    });
});

test('It should be able to handle the resetting of state;', (t) => {
    const wrapper = mount(<Example />);
    const buttons = wrapper.find('section.reset button');

    t.plan(buttons.length);
    buttons.forEach((button) => {
        button.simulate('click');
        t.snapshot(wrapper.find('code').html());
    });
});

test('It should be able to yield the same curried functions regardless of invocation;', (t) => {
    function Compare() {
        const [, { set }] = useMap({});

        t.is(set('user'), set('user'));
        t.is(set('user.firstName'), set('user.firstName'));
        t.not(set('user.firstName'), set('user.lastName'));

        return null;
    }

    t.plan(3);
    mount(<Compare />);
});
