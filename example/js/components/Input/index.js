import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as e from './styles';

function Input(props) {
    return <e.Input {...props} onChange={({ target }) => props.onChange(target.value)} />;
}

Input.propTypes = { onChange: PropTypes.func.isRequired };

export default memo(Input);
