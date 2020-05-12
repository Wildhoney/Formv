import React from 'react';
import PropTypes from 'prop-types';

export default function Field({ children }) {
    return <fieldset style={{ display: 'contents' }}>{children}</fieldset>;
}

Field.propTypes = { children: PropTypes.node.isRequired };
