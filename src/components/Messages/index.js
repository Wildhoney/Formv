import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

function Messages({ field, ...props }) {
    // Gather the validation messages from either the browser's
    // defaults, or the custom messages if the developer has set them up.
    const messages = utils.getMessages(field, props.messages);

    return (
        <ul>
            {messages.map((message, index) => (
                <li key={`message_${index}`}>{message}</li>
            ))}
        </ul>
    );
}

Messages.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.instanceOf(global.HTMLElement).isRequired,
    messages: PropTypes.object,
};

Messages.defaultProps = { messages: {} };

export default memo(
    Messages,
    (prevProps, nextProps) => prevProps.id === nextProps.id,
);
