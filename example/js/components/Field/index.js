import React from 'react';
import PropTypes from 'prop-types';
import * as e from './styles';

export default function Field({ children, ...props }) {
    return <e.Container>{children}</e.Container>;
}

Field.propTypes = { children: PropTypes.node.isRequired };
