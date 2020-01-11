import React from 'react';
import { isNil, isEmpty } from 'ramda';
import PropTypes from 'prop-types';

export default function Messages({ className, style, value, values }) {
    if (!isNil(value))
        return (
            <div className={className} style={style}>
                {value}
            </div>
        );

    if (!isNil(values) && !isEmpty(values))
        return (
            <ul className={className} style={style}>
                {values.map(value => (
                    <li key={`message_${value}`}>{value}</li>
                ))}
            </ul>
        );

    return null;
}

Messages.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
};

Messages.defaultProps = { className: null, style: {}, value: null, values: [] };
