import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Messages from '../Messages';
import { Context } from '../Form';
import * as utils from './utils';

export default function Field({ position, messages, children, ...props }) {
    // Gather the context from the parent Form component.
    const context = useContext(Context);

    // Hold a reference to the contained field element.
    const [field, setField] = useState(null);
    const augmentedProps = { ...context, field, setField };
    const handleField = utils.handleField(augmentedProps);

    // Determine if the field is contained within the invalid forms determined
    // by the form component.
    const isInvalid = context.store.invalidFields.includes(field);

    // Add or remove the "invalid" class name of the field.
    field && field.classList[isInvalid ? 'add' : 'remove']('invalid');

    return (
        <div ref={handleField} style={{ display: 'contents' }} {...props}>
            {isInvalid && utils.isBefore(position) && (
                <Messages
                    id={context.store.id}
                    field={field}
                    messages={messages}
                />
            )}

            {children}

            {isInvalid && utils.isAfter(position) && (
                <Messages
                    id={context.store.id}
                    field={field}
                    messages={messages}
                />
            )}
        </div>
    );
}

Field.propTypes = {
    messages: PropTypes.object,
    position: PropTypes.oneOf(['before', 'after']),
    children: PropTypes.node.isRequired,
};

Field.defaultProps = { messages: {}, position: 'after', className: '' };
