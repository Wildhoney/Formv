import React from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import Field from './';
import Form from '../Form';
import Messages from '../Messages';

test('It should be able to handle the displaying of native validation messages;', t => {
    const wrapper = mount(
        <Form onSubmit={() =>{} }>
            <Field>
                <input type="text" name="example" required />
            </Field>
        </Form>,
    );

    t.is(wrapper.find(Messages).length, 2);
    t.is(wrapper.find(Messages).at(0).text(), '');
    t.is(wrapper.find(Messages).at(1).text(), '');

    wrapper.find("form").simulate("submit")
    t.is(wrapper.find(Field).find(Messages).text(), 'Constraints not satisfied');
});

test('It should be able to handle the displaying of custom validation messages;', t => {
    const wrapper = mount(
        <Form onSubmit={() =>{} }>
            <Field messages={{valueMissing: "Please enter a bit of text."}}>
                <input type="text" name="example" required />
            </Field>
        </Form>,
    );

    wrapper.find("form").simulate("submit")
    t.is(wrapper.find(Field).find(Messages).text(), 'Please enter a bit of text.');
});