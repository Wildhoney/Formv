import React from 'react';
import PropTypes from 'prop-types';
import * as fv from 'formv';
import * as e from './styles';

export default function Messages({ type, value }) {
    if (!value) return null;

    switch (type) {
        case 'success':
            return (
                <fv.Field>
                    <e.Success>{value}</e.Success>
                </fv.Field>
            );

        case 'generic':
            return (
                <fv.Field>
                    <e.GenericError>{value}</e.GenericError>
                </fv.Field>
            );

        case 'validation':
            return (
                <e.ValidationError>
                    {value.map((message) => (
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
