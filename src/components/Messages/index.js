import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

function Messages({
    field,
    customMessages,
    validityMessages,
    genericMessages,
}) {
    // Gather the validation messages from either the browser's
    // defaults, or the custom messages if the developer has set them up.
    const messages = [
        ...(field ? utils.getMessages(field, customMessages) : []),
        ...[].concat(validityMessages),
        ...genericMessages,
    ];

    return (
        <ul ref={utils.handleScroll(genericMessages)}>
            {messages.filter(Boolean).map((message, index) => (
                <li key={`message_${index}`}>{message}</li>
            ))}
        </ul>
    );
}

Messages.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.instanceOf(global.HTMLElement),
    customMessages: PropTypes.object,
    validityMessages: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    genericMessages: PropTypes.array,
};

Messages.defaultProps = {
    customMessages: {},
    validityMessages: [],
    genericMessages: [],
};

export default memo(
    Messages,
    (prevProps, nextProps) => prevProps.id === nextProps.id,
);
