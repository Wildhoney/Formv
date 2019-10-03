import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

function Messages({ field, noScroll, successMessage, genericMessages, ...props }) {
    // Determine whether we have a success message to render, rather than validation
    // and/or generic error messages.
    if (successMessage)
        return (
            <div
                ref={utils.handleScroll({ successMessage, noScroll })}
                className={`formv-messages ${props.className}`.trim()}
            >
                {successMessage}
            </div>
        );

    // Gather the validation messages from either the browser's
    // defaults, or the custom messages if the developer has set them up.
    const messages = [
        ...(field ? utils.getMessages(field, props.customMessages) : []),
        ...[].concat(props.validityMessages),
        ...genericMessages,
    ];

    return (
        <ul
            ref={utils.handleScroll({ genericMessages, noScroll })}
            className={`formv-messages formv-messages-${
                messages.length > 1 ? 'multiple' : 'single'
            } ${props.className}`.trim()}
        >
            {!successMessage &&
                messages
                    .filter(Boolean)
                    .map((message, index) => <li key={`message_${index}`}>{message}</li>)}
        </ul>
    );
}

Messages.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.instanceOf(global.HTMLElement),
    noScroll: PropTypes.bool,
    className: PropTypes.string.isRequired,
    successMessage: PropTypes.node,
    customMessages: PropTypes.object,
    genericMessages: PropTypes.array,
    validityMessages: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

Messages.defaultProps = {
    noScroll: false,
    successMessage: null,
    customMessages: {},
    validityMessages: [],
    genericMessages: [],
};

export default memo(Messages, (prevProps, nextProps) => prevProps.id === nextProps.id);
