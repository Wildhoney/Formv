import React from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import delay from 'delay';
import Messages from '../../Messages';
import * as utils from '../utils';
import Form from '../';

test('It should be able to handle the displaying of generic error messages;', async t => {
    const onSubmit = () => {
        throw new utils.GenericError('Something really bad occurred.');
    };
    const wrapper = mount(<Form onSubmit={onSubmit}></Form>);
    wrapper.find(Form).simulate('submit');
    await delay(1);
    t.is(wrapper.find(Messages).length, 1);
    t.snapshot(wrapper.find(Messages).text());
});

test('It should be able to disable the entire form when submitting;', async t => {
    const onSubmit = () => {};
    const wrapper = mount(<Form onSubmit={onSubmit} />);
    t.false(wrapper.find('fieldset').props().disabled);
    wrapper.find(Form).simulate('submit');
    t.true(wrapper.find('fieldset').props().disabled);
    await delay(1);
    wrapper.update();
    t.false(wrapper.find('fieldset').props().disabled);
});
