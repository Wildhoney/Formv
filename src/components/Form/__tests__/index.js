import test from 'ava';
import { mount } from 'enzyme';
import React from 'react';
import delay from 'delay';
import sinon from 'sinon';
import Form from '../../Container';
import { actions } from '../../Store';
import * as utils from '../../Form/utils';

test('It should be able to handle the onChange event;', (t) => {
    const spies = { onChange: sinon.spy() };
    sinon.stub(actions, 'dirtyCheck').callThrough();

    const wrapper = mount(<Form withDirtyCheck onChange={spies.onChange} />);
    const form = wrapper.find('form');
    form.simulate('change');

    t.is(spies.onChange.callCount, 1);
    t.is(actions.dirtyCheck.callCount, 1);
    t.true(actions.dirtyCheck.calledWith({ current: form.getDOMNode() }, sinon.match.array));
    actions.dirtyCheck.restore();
});

test('It should be able to handle the onClick event;', (t) => {
    const spies = { onClick: sinon.spy() };
    sinon.stub(utils, 'isSubmitButton').callThrough();

    const wrapper = mount(<Form onClick={spies.onClick} />);
    wrapper.find('form').simulate('click');

    t.is(spies.onClick.callCount, 1);
    t.is(utils.isSubmitButton.callCount, 1);
    t.true(utils.isSubmitButton.calledWith(sinon.match.instanceOf(global.HTMLElement)));
    utils.isSubmitButton.restore();
});

test('It should be able to handle the onReset event;', (t) => {
    const spies = { onReset: sinon.spy() };
    sinon.stub(actions, 'reset').callThrough();

    const wrapper = mount(<Form onReset={spies.onReset} />);
    const form = wrapper.find('form');
    form.simulate('reset');

    t.is(spies.onReset.callCount, 1);
    t.is(actions.reset.callCount, 1);
    t.true(actions.reset.calledWith({ current: form.getDOMNode() }));
    actions.reset.restore();
});

test('It should be able to handle the onSubmit event;', async (t) => {
    const spies = {
        onSubmitting: sinon.spy(),
        onSubmitted: sinon.spy(),
        event: { preventDefault: sinon.spy() },
    };

    sinon.stub(utils, 'submitForm').callThrough();
    sinon.stub(actions, 'submitting').callThrough();
    sinon.stub(actions, 'submitted').callThrough();

    const wrapper = mount(
        <Form onSubmitting={spies.onSubmitting} onSubmitted={spies.onSubmitted} />,
    );
    const form = wrapper.find('form');
    form.simulate('submit', spies.event);

    await delay(1);

    t.is(spies.onSubmitting.callCount, 1);
    t.is(spies.onSubmitted.callCount, 1);
    t.is(spies.event.preventDefault.callCount, 1);

    t.is(utils.submitForm.callCount, 1);
    t.is(actions.submitting.callCount, 1);
    t.is(actions.submitted.callCount, 1);

    t.true(utils.submitForm.calledWith(sinon.match.object));
    t.true(actions.submitted.calledWith(sinon.match.object));

    utils.submitForm.restore();
    actions.submitting.restore();
    actions.submitted.restore();
});

test('It should be able to invoke the initialise function on mount;', (t) => {
    sinon.stub(actions, 'initialise').callThrough();

    const wrapper = mount(<Form />);
    const form = wrapper.find('form');
    form.simulate('reset');

    t.is(actions.initialise.callCount, 1);
    t.true(actions.initialise.calledWith({ current: form.getDOMNode() }));
});

test('It should be able to handle both standard children and function as children;', (t) => {
    const wrapper = mount(
        <Form>
            <div>Privet Imogen!</div>
        </Form>,
    );
    const html = wrapper.html();
    t.snapshot(html);

    {
        const wrapper = mount(<Form>{() => <div>Privet Imogen!</div>}</Form>);
        t.is(wrapper.html(), html);
        t.snapshot(wrapper.html());
    }

    {
        const wrapper = mount(
            <Form>{(formState) => <code>{JSON.stringify(formState, null, '\t')}</code>}</Form>,
        );
        t.snapshot(wrapper.html());
    }
});
