import test from 'ava';
import starwars from 'starwars';
import { mount } from 'enzyme';
import React from 'react';
import Messages from '../';

test('It should be able to the messages elegantly when passing a string;', (t) => {
    const text = starwars();
    const wrapper = mount(<Messages value={text} />);
    t.is(wrapper.html(), `<div>${text}</div>`);

    wrapper.setProps({ value: null, values: text });
    t.is(wrapper.html(), `<div>${text}</div>`);
});

test('It should be able to the messages elegantly when passing an array of strings;', (t) => {
    const text = [starwars(), starwars()];
    const wrapper = mount(<Messages values={text} />);
    t.is(wrapper.html(), `<ul><li>${text[0]}</li><li>${text[1]}</li></ul>`);

    wrapper.setProps({ values: null, value: text });
    t.is(wrapper.html(), `<ul><li>${text[0]}</li><li>${text[1]}</li></ul>`);
});

test('It should be able to handle null values passed in as messages;', (t) => {
    const wrapper = mount(<Messages />);
    t.is(wrapper.html(), null);

    wrapper.setProps({ value: [] });
    t.is(wrapper.html(), null);

    wrapper.setProps({ values: [] });
    t.is(wrapper.html(), null);
});
