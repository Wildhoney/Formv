import React from 'react';
import PropTypes from 'prop-types';
import * as e from './styles';

export default function Messages({ type, value }) {
    if (!value) return null;

    switch (type) {
        case 'success':
            return <e.Success>{value}</e.Success>;

        case 'generic':
            return <e.GenericError>{value}</e.GenericError>;

        case 'validation':
            return (
                <e.ValidationError>
                    {value.map(message => (
                        <li key={`message_${message}`}>{message}</li>
                    ))}
                </e.ValidationError>
            );
    }
}

Messages.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
};

Messages.defaultProps = {
    value: null,
};
