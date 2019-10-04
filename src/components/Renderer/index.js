import React from 'react';
import PropTypes from 'prop-types';

export default function Renderer({ type, message, messages, className }) {
    switch (type) {
        case 'success':
            return <div className={`formv-messages ${className}`.trim()}>{messages}</div>;

        default:
            return (
                <ul
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
