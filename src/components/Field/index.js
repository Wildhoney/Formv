import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Messages from '../Messages';
import { Context } from '../Form';
import * as utils from './utils';

export default function Field({ position, messages, children, ...props }) {
    // Gather the context from the parent Form component.
    const context = useContext(Context);

    // Hold a reference to the contained field element.
    const [container, setContainer] = useState(null);
    const [field, setField] = useState(null);
    const name = field && field.name;
    const augmentedProps = {
        ...context,
        container,
        field,
        messages,
        setContainer,
        setField,
    };
    const handleField = utils.handleField(augmentedProps);

    // Used to scroll to the first invalid element.
    utils.handleScroll(augmentedProps);

    // Reset custom validity upon render.
    field && field.setCustomValidity('');

    // Determine if the field is contained within the invalid forms determined
    // by the form component.
    const isInvalid = context.store.invalidFields.includes(field);

    // Add or remove the "invalid" class name of the field.
    field && field.classList[isInvalid ? 'add' : 'remove']('invalid');

    return (
        <div
            ref={handleField}
            style={utils.getStyles(context.legacy)}
            className={`formv-field ${props.className}`.trim()}
            {...props}
        >
            {isInvalid && utils.isBefore(position) && (
                <Messages
                    id={context.store.id}
                    type="error-validation"
                    className="formv-messages-error-validation"
                    field={field}
                    legacy={context.legacy}
                    customMessages={messages}
                    validityMessages={context.store.validityMessages[name]}
                    renderer={context.renderer}
                />
            )}

            {children}

            {isInvalid && utils.isAfter(position) && (
                <Messages
                    id={context.store.id}
                    type="error-validation"
                    className="formv-messages-error-validation"
                    field={field}
                    legacy={context.legacy}
                    customMessages={messages}
                    validityMessages={context.store.validityMessages[name]}
                    renderer={context.renderer}
                />
            )}
        </div>
    );
}

Field.propTypes = {
    messages: PropTypes.object,
    position: PropTypes.oneOf(['before', 'after']),
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

Field.defaultProps = { messages: {}, position: 'after', className: '' };
