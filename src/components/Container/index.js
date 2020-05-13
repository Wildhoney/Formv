import React from 'react';
import PropTypes from 'prop-types';
import { ensuredForwardRef } from 'react-use';
import Store from '../Store';
import Form from '../Form';

const Container = ensuredForwardRef((props, ref) => {
    return (
        <Store dirtyCheck={props.dirtyCheck}>
            <Form ref={ref} {...props} />
        </Store>
    );
});

Container.propTypes = { dirtyCheck: PropTypes.bool };

Container.defaultProps = { dirtyCheck: false };

export default Container;
