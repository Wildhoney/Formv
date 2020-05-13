import React from 'react';
import PropTypes from 'prop-types';
import { useTracked } from '../Store';

export default function Field({ children }) {
    const [state] = useTracked();

    return (
        <fieldset data-id={state.meta.id} style={{ display: 'contents' }}>
            {children}
        </fieldset>
    );
}

Field.propTypes = { children: PropTypes.node.isRequired };
