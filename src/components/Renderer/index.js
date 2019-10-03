import React from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

export default function Renderer({ type, message, messages, className, noScroll }) {
    switch (type) {
        case 'success':
            return (
                <div
                    ref={utils.handleScroll({ successMessage: message, noScroll })}
                    className={`formv-messages ${className}`.trim()}
                >
                    {messages}
                </div>
            );

        default:
            return (
                <ul
                    ref={utils.handleScroll({ genericMessages: messages, noScroll })}
                    className={`formv-messages formv-messages-${
                        messages.length > 1 ? 'multiple' : 'single'
                    } ${className}`.trim()}
                >
                    {messages.filter(Boolean).map((message, index) => (
                        <li key={`message_${index}`}>{message}</li>
                    ))}
                </ul>
            );
    }
}

Renderer.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string.isRequired,
    noScroll: PropTypes.bool,
};
