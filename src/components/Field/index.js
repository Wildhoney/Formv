import React from 'react';
import PropTypes from 'prop-types';
import { useTrackedState } from '../Store';

export default function Field({ children }) {
    const state = useTrackedState();

    return (
        <fieldset data-id={state.meta.id} style={{ display: 'contents' }}>
            {children}
        </fieldset>
    );
}

Field.propTypes = { children: PropTypes.node.isRequired };
