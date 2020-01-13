import React from 'react';
import { isNil, isEmpty } from 'ramda';
import PropTypes from 'prop-types';

export default function Messages({ className, style, ...props }) {
    const value = isNil(props.value) && isEmpty(props.value) ? props.values : props.value;

    if (isNil(value) && isEmpty(value)) return null;

    if (Array.isArray(value))
        return (
            <ul className={className} style={style}>
                {value.map(value => (
                    <li key={`message_${value}`}>{value}</li>
                ))}
            </ul>
        );

    return (
        <div className={className} style={style}>
            {value}
        </div>
    );
}

Messages.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
};

Messages.defaultProps = { className: null, style: {}, value: null, values: [] };
