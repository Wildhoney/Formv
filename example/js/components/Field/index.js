import React from 'react';
import PropTypes from 'prop-types';
import * as fv from 'formv';
import * as e from './styles';

export default function Field({ children, ...props }) {
    return (
        <fv.Field {...props}>
            <e.Container>{children}</e.Container>
        </fv.Field>
    );
}

Field.propTypes = { children: PropTypes.node.isRequired };
