import React from 'react';
import Store from '../Store';
import Form from '../Form';

export default function Container(props) {
    return (
        <Store>
            <Form {...props} />
        </Store>
    );
}
