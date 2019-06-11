import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Messages from '../Messages';
import { Context } from '../Form';
import * as utils from './utils';

export default function Field({ children, ...props }) {
    const context = useContext(Context);
    const [field, setField] = useState(null);
    const input = utils.findInput(context.form.current, field);
    const messages = utils.formatMessages(
        input,
        props.messages,
        input && context.messages.validity[input.name]
            ? [].concat(context.messages.validity[input.name])
            : [],
    );

    useEffect(utils.handleScroll(input, messages, context, field), [messages]);

    return (
        <div
            className={`formv-field ${props.className}`.trim()}
            style={{ display: 'var(--formv-field-display, contents)' }}
            ref={node => node && setField(node)}
        >
            {typeof children === 'function' ? children(messages) : children}
            <Messages className="validity" values={messages} />
        </div>
    );
}

Field.propTypes = {
    messages: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

Field.defaultProps = { messages: {}, className: '' };
