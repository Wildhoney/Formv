import React from 'react';
import PropTypes from 'prop-types';
import { ensuredForwardRef } from 'react-use';
import Store from '../Store';
import Form from '../Form';

const Container = ensuredForwardRef((props, ref) => {
    return (
        <Store withDirtyCheck={props.withDirtyCheck}>
            <Form ref={ref} {...props} />
        </Store>
    );
});

Container.propTypes = { withDirtyCheck: PropTypes.bool };

Container.defaultProps = { withDirtyCheck: false };

export default Container;
