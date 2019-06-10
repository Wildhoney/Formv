import test from 'ava';
import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import delay from 'delay';
import { Form, Field, ValidationError } from '../';

test('It should be able to handle the spready of class names on the form element;', t => {
    const wrapper = mount(
        <Form onSubmit={() => {}} className="my-form">
            Hello Adam!
        </Form>,
    );
    t.true(wrapper.find('form').hasClass('vform'));
    t.true(wrapper.find('form').hasClass('my-form'));
});

test('It should be able to append passed children to the form;', t => {
    const wrapper = mount(<Form onSubmit={() => {}}>Hello Maria!</Form>);
    t.is(wrapper.text(), 'Hello Maria!');
});

test('It should be able to handle the form submission when there are no named elements;', async t => {
    const submitSpy = sinon.spy();
    const wrapper = mount(
        <Form onSubmit={submitSpy}>
            <Field>
                <input type="text" />
            </Field>
        </Form>,
    );

    wrapper.find('form').simulate('submit');
    await delay(1);
    t.is(submitSpy.callCount, 1);
});

test('It should be able to disable the fieldset when the form is being submitted;', async t => {
    const wrapper = mount(
        <Form onSubmit={() => {}}>
            <Field>
                <input type="text" />
            </Field>
        </Form>,
    );

    wrapper.find('form').simulate('submit');
    t.true(wrapper.find('fieldset').props().disabled);
    await delay(1);
    wrapper.update();
    t.false(wrapper.find('fieldset').props().disabled);
});

test('It should be able to the validation messages for the relevant input fields;', t => {
    const wrapper = mount(
        <Form onSubmit={() => {}}>
            <Field>
                <input type="text" name="first" required />
            </Field>
            <Field>
                <input type="text" name="second" required />
            </Field>
        </Form>,
    );

    wrapper.find('form').simulate('submit');
    t.is(
        wrapper
            .find(Field)
            .at(0)
            .find('ul.vform-messages')
            .text(),
        'Constraints not satisfied',
    );
    t.is(
        wrapper
            .find(Field)
            .at(1)
            .find('ul.vform-messages')
            .text(),
        'Constraints not satisfied',
    );

    const inputElement = wrapper
        .find(Field)
        .at(1)
        .find('input')
        .getDOMNode();
    inputElement.value = 'Maria';
    wrapper.find('form').simulate('submit');
    t.is(
        wrapper
            .find(Field)
            .at(0)
            .find('ul.vform-messages')
            .text(),
        'Constraints not satisfied',
    );
    t.is(
        wrapper
            .find(Field)
            .at(1)
            .find('ul.vform-messages').length,
        0,
    );
});

test('It should be able to handle custom ValidationError exceptions;', t => {
    const handleSubmit = () => {
        throw new ValidationError({ first: 'Please enter your first name' });
    };

    const wrapper = mount(
        <Form onSubmit={handleSubmit}>
            <Field>
                <input type="text" name="first" />
            </Field>
        </Form>,
    );

    wrapper.find('form').simulate('submit');
    t.is(
        wrapper
            .find(Field)
            .at(0)
            .find('ul.vform-messages')
            .text(),
        'Please enter your first name',
    );
});

test('It should be able to determine whether there are multiple or single messages;', async t => {
    const handleSubmit = () => {
        throw new ValidationError({ first: 'Please enter your first name' });
    };

    const wrapper = mount(
        <Form onSubmit={handleSubmit}>
            <Field>
                <input type="text" name="first" />
            </Field>
        </Form>,
    );

    wrapper.find('form').simulate('submit');
    await delay(1);
    t.true(
        wrapper
            .find(Field)
            .at(0)
            .find('ul.vform-messages')
            .hasClass('vform-messages-single'),
    );

    {
        const handleSubmit = () => {
            throw new ValidationError({
                first: ['Please enter your first name', 'Constraint failed'],
            });
        };
        wrapper.setProps({ onSubmit: handleSubmit });
        wrapper.find('form').simulate('submit');
        await delay(1);
        t.true(
            wrapper
                .find(Field)
                .at(0)
                .find('ul.vform-messages')
                .hasClass('vform-messages-multiple'),
        );
    }
});

test('It should be able to pass an array of `onSubmit` functions;', async t => {
    const handleSubmitting = sinon.spy();
    const handleSubmitted = sinon.spy();

    const wrapper = mount(
        <Form onSubmit={[handleSubmitting, handleSubmitted]}>
            <Field>
                <input type="text" name="first" defaultValue="Hello Adam!" />
            </Field>
        </Form>,
    );

    wrapper.find('form').simulate('submit');
    t.is(handleSubmitting.callCount, 1);
    await delay(1);
    t.is(handleSubmitted.callCount, 1);
});

test('It should be able to display the passed custom messages;', async t => {
    const wrapper = mount(
        <Form onSubmit={() => {}}>
            <Field messages={{ valueMissing: 'Where are thou?' }}>
                <input type="text" name="first" required />
            </Field>
        </Form>,
    );

    wrapper.find('form').simulate('submit');
    await delay(1);
    t.is(
        wrapper
            .find('li')
            .at(0)
            .text(),
        'Where are thou?',
    );
});
