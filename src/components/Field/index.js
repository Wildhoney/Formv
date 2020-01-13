import React, { useContext, createContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';
import { useMount } from 'react-use';

export const Context = createContext(() => {});

export default function Field({ className, messages, children }) {
    const fieldset = useRef(null);
    const fieldState = useContext(Context);

    useMount(() => {
        // Apply any custom field messages.
        if (messages) fieldState.setMessages(messages);
    });

    useEffect(() => {
        fieldset.current && fieldState.addField(fieldset.current);
        if (!fieldState.highestField) return;

        // Determine if the current fieldset is the highest in the DOM.
        const isHighest =
            fieldset.current.contains(fieldState.highestField) ||
            fieldset.current === fieldState.highestField;

        setTimeout(() => {
            isHighest &&
                fieldset.current.firstChild.scrollIntoView({ block: 'start', behavior: 'smooth' });
        });
    }, [fieldState.highestField, fieldset]);

    return (
        <fieldset ref={fieldset} style={utils.getStyles()} className={className}>
            {children}
        </fieldset>
    );
}

Field.propTypes = {
    messages: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
};

Field.defaultProps = {
    messages: null,
    className: null,
    children: <></>,
};
