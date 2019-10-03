import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

function Messages({
    type,
    field,
    successMessage,
    genericMessages,
    className,
    renderer: Renderer,
    ...props
}) {
    // Determine whether we have a success message to render, rather than validation
    // and/or generic error messages.
    if (successMessage)
        return <Renderer type={type} className={className} message={successMessage} />;

    // Gather the validation messages from either the browser's
    // defaults, or the custom messages if the developer has set them up.
    const messages = [
        ...(field ? utils.getMessages(field, props.customMessages) : []),
        ...[].concat(props.validityMessages),
        ...genericMessages,
    ];

    return <Renderer type={type} className={className} messages={messages} />;
}

Messages.propTypes = {
    renderer: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error-generic', 'error-validation']).isRequired,
    className: PropTypes.string.isRequired,
    field: PropTypes.instanceOf(global.HTMLElement),
    noScroll: PropTypes.bool,
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
