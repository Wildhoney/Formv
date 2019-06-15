import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Messages from '../Messages';
import { Context } from '../Form';
import * as utils from './utils';

export default function Field({ position, children, ...props }) {
    const context = useContext(Context);
    const [field, setField] = useState(null);
    const input = utils.findContainedInput(context.form, field);
    const messages = utils.mapCustomMessages(
        input,
        props.messages,
        input && context.messages.validity[input.name]
            ? [].concat(context.messages.validity[input.name])
            : [],
    );

    useEffect(
        () => utils.handleInputInvalidation(input, messages, context, field),
        [messages],
    );

    return (
        <div
            ref={node => node && setField(node)}
            className={`formv-field ${props.className}`.trim()}
            style={{ display: 'var(--formv-field-display, contents)' }}
        >
            {position === 'before' && (
                <Messages className="validity" values={messages} />
            )}
            {typeof children === 'function' ? children(messages) : children}
            {position === 'after' && (
                <Messages className="validity" values={messages} />
            )}
        </div>
    );
}

Field.propTypes = {
    messages: PropTypes.object,
    position: PropTypes.oneOf(['before', 'after']),
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

Field.defaultProps = { messages: {}, position: 'after', className: '' };
