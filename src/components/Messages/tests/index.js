import React from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import Messages from '../';

test('It should be able to handle the rendering of messages;', t => {
    const wrapper = mount(<Messages values={[]} />);
    t.is(wrapper.text(), '');
    wrapper.setProps({ values: ['Please fill in the field with some text.'] });
    t.snapshot(wrapper.html());

    const messages = [
        'Please fill in the field with some text.',
        'Please ensure the text exceeds 15 characters.',
    ];
    wrapper.setProps({ values: messages });
    t.snapshot(wrapper.html());
    wrapper.setProps({ className: 'generic', values: messages });
    t.snapshot(wrapper.html());
    wrapper.setProps({ className: 'validity', values: messages });
    t.snapshot(wrapper.html());
});
