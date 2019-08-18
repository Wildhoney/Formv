import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Messages from '../Messages';
import { Context } from '../Form';
import * as utils from './utils';

const styles = { display: 'var(--formv-field-display, contents)' };

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
        setContainer,
        setField,
    };
    const handleField = utils.handleField(augmentedProps);

    // Used to scroll to the first invalid element.
    utils.handleScroll(augmentedProps);

    // Determine if the field is contained within the invalid forms determined
    // by the form component.
    const isInvalid = context.store.invalidFields.includes(field);

    // Add or remove the "invalid" class name of the field.
    field && field.classList[isInvalid ? 'add' : 'remove']('invalid');

    return (
        <div
            ref={handleField}
            style={styles}
            className={`formv-field ${props.className}`.trim()}
            {...props}
        >
            {isInvalid && utils.isBefore(position) && (
                <Messages
                    id={context.store.id}
                    className="formv-messages-validity"
                    field={field}
                    customMessages={messages}
                    validityMessages={context.store.validityMessages[name]}
                />
            )}

            {children}

            {isInvalid && utils.isAfter(position) && (
                <Messages
                    id={context.store.id}
                    className="formv-messages-validity"
                    field={field}
                    customMessages={messages}
                    validityMessages={context.store.validityMessages[name]}
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
