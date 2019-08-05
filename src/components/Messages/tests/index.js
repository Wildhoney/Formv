import React from 'react';
import test from 'ava';
import { mount } from 'enzyme';
import id from 'nanoid';
import Messages from '../';

test('It should be able to handle the rendering of messages;', t => {
    const wrapper = mount(<Messages values={[]} hash={id()} />);
    t.is(wrapper.text(), '');
    wrapper.setProps({
        values: ['Please fill in the field with some text.'],
        hash: id(),
    });
    t.snapshot(wrapper.html());

    const messages = [
        'Please fill in the field with some text.',
        'Please ensure the text exceeds 15 characters.',
    ];
    wrapper.setProps({ values: messages, hash: id() });
    t.snapshot(wrapper.html());
    wrapper.setProps({ className: 'generic', values: messages, hash: id() });
    t.snapshot(wrapper.html());
    wrapper.setProps({ className: 'validity', values: messages, hash: id() });
    t.snapshot(wrapper.html());

    // Not updating the hash should not update the component.
    wrapper.setProps({
        className: 'generic',
        values: [
            'Another message that should not be shown because the hash was not updated.',
        ],
    });
    t.snapshot(wrapper.html());

    // Updating the hash should then show the message above.
    wrapper.setProps({ hash: id() });
    t.snapshot(wrapper.html());
});
