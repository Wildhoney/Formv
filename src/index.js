import React from 'react';
import PropTypes from 'prop-types';

export function Form({ children, onSubmit, ...props }) {
    return (
        <form onSubmit={onSubmit} {...props}>
            {children}
        </form>
    );
}

Form.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export function Field({ children }) {
    return (
        <>
            <ul />
            {children}
        </>
    );
}

Field.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export class ValidationError extends Error {}
