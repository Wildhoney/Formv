import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as e from './styles';

function Textarea(props) {
    return <e.Textarea {...props} onChange={({ target }) => props.onChange(target.value)} />;
}

Textarea.propTypes = { onChange: PropTypes.func.isRequired };

export default memo(Textarea);
