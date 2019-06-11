import React from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

export default function Messages({ values, className }) {
    return values.length === 0 ? null : (
        <ul className={utils.getClassNames({ values, className })}>
            {values.map((message, index) => (
                <li key={`message_${index}`}>{message}</li>
            ))}
        </ul>
    );
}

Messages.propTypes = {
    values: PropTypes.array.isRequired,
    className: PropTypes.string,
};

Messages.defaultProps = { values: [], className: '' };
