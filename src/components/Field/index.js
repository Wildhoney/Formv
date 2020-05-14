import React from 'react';
import PropTypes from 'prop-types';
import { ensuredForwardRef } from 'react-use';
import { useTrackedState } from '../Store';

const Field = ensuredForwardRef(({ children }, ref) => {
    const state = useTrackedState();

    return (
        <fieldset ref={ref} data-id={state.meta.id} style={{ display: 'contents' }}>
            {children}
        </fieldset>
    );
});

Field.propTypes = { children: PropTypes.node.isRequired };

export default Field;
