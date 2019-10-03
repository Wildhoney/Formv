import React from 'react';
import PropTypes from 'prop-types';
import * as e from './styles';

export default function Messages({ type, message, messages }) {
    switch (type) {
        case 'success':
            return <e.Success>{message}</e.Success>;

        case 'error-generic':
            return (
                <e.GenericError>
                    {messages.map(message => (
                        <li key={`message_${message}`}>{message}</li>
                    ))}
                </e.GenericError>
            );

        case 'error-validation':
            return (
                <e.ValidationError>
                    {messages.map(message => (
                        <li key={`message_${message}`}>{message}</li>
                    ))}
                </e.ValidationError>
            );
    }
}

Messages.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.string),
};
