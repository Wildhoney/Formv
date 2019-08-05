import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

function Messages({ values, hash, className }) {
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
    hash: PropTypes.string.isRequired,
    className: PropTypes.string,
};

Messages.defaultProps = { values: [], className: '' };

export default memo(
    Messages,
    (prevProps, nextProps) => prevProps.hash === nextProps.hash,
);
