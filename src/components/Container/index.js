import React from 'react';
import { ensuredForwardRef } from 'react-use';
import Store from '../Store';
import Form from '../Form';

function Container(props, ref) {
    return (
        <Store>
            <Form ref={ref} {...props} />
        </Store>
    );
}

export default ensuredForwardRef(Container);
