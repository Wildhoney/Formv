import React, { useContext, createContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMount, useMountedState } from 'react-use';
import * as utils from './utils';

export const Context = createContext(() => {});

export default function Field({ className, messages, children }) {
    const fieldset = useRef(null);
    const isMounted = useMountedState();
    const fieldState = useContext(Context);

    useMount(() => {
        // Apply any custom field messages.
        if (messages) isMounted() && fieldState.setMessages(messages);
    });

    useEffect(() => {
        if (!isMounted()) return;

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
