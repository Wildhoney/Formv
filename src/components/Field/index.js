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
    const [fields, setFields] = useState([]);
    const names = fields.map(({ name }) => name);
    const augmentedProps = {
        ...context,
        container,
        fields,
        messages,
        setContainer,
        setFields,
    };
    const handleField = utils.handleField(augmentedProps);

    // Used to scroll to the first invalid element.
    utils.handleScroll(augmentedProps);

    // Reset custom validity upon render.
    fields.forEach(field => field.setCustomValidity(''));

    // Determine if the field is contained within the invalid forms determined
    // by the form component.
    const isInvalid = context.store.invalidFields.some(field => fields.includes(field));

    // Add or remove the "invalid" class name of the field.
    fields.forEach(field => field.classList[isInvalid ? 'add' : 'remove']('invalid'));

    console.log(context.store.validityMessages);

    return (
        <div
            ref={handleField}
            style={utils.getStyles(context.legacy)}
            className={`formv-field ${props.className}`.trim()}
            {...props}
        >
            {isInvalid && utils.isBefore(position) && (
                <Messages {...utils.getMessageProps({ context, fields, messages, names })} />
            )}

            {children}

            {isInvalid && utils.isAfter(position) && (
                <Messages {...utils.getMessageProps({ context, fields, messages, names })} />
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
