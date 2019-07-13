import React from 'react';
import PropTypes from 'prop-types';
import * as fv from 'formv';
import * as e from './styles';

export default function Field({ children, ...props }) {
    return (
        <e.Container>
            <fv.Field {...props}>{children}</fv.Field>
        </e.Container>
    );
}

Field.propTypes = { children: PropTypes.node.isRequired };
