import React from 'react';
import { isNil, isEmpty } from 'ramda';
import PropTypes from 'prop-types';

export default function Messages({ style, value, values }) {
    if (!isNil(value)) return <div style={style}>{value}</div>;

    if (!isNil(values) && !isEmpty(values))
        return (
            <ul style={style}>
                {values.map(value => (
                    <li key={`message_${value}`}>{value}</li>
                ))}
            </ul>
        );

    return null;
}

Messages.propTypes = {
    style: PropTypes.object,
    value: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
};

Messages.defaultProps = {
    style: {},
    value: null,
    values: [],
};
