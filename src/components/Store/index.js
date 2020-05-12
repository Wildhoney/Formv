import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'react-tracked';

const useValue = ({ reducer, initialState }) => useReducer(reducer, initialState);

export const { Provider, useTracked } = createContainer(useValue);

const initialState = {
    isValid: true,
    isDirty: false,
    isSubmitting: false,
    isSubmitted: false,
    feedback: {
        field: {},
    },
    meta: {
        fields: [],
        data: [],
        highest: null,
        active: null,
    },
};

export const actionTypes = {
    initialise: Symbol('initialise'),
    reset: Symbol('reset'),
    submitting: Symbol('submitting'),
    submitted: Symbol('submitted'),
    dirtyCheck: Symbol('dirtyCheck'),
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.initialise:
            return { ...state, isValid: action.payload.isValid };

        case actionTypes.reset:
            return {
                ...initialState,
                isValid: action.payload.isValid,
                isDirty: action.payload.isDirty,
                isSubmitted: state.isSubmitted,
            };

        case actionTypes.submitting:
            return {
                ...initialState,
                isDirty: state.isDirty,
                isSubmitted: state.isSubmitted,
                isSubmitting: true,
            };

        case actionTypes.submitted:
            return {
                ...state,
                isSubmitting: false,
                isSubmitted: true,
                ...action.payload,
            };

        case actionTypes.dirtyCheck:
            return {
                ...state,
                isDirty: action.payload.isDirty,
            };
    }
};

export default function Store({ children }) {
    return (
        <Provider reducer={reducer} initialState={initialState}>
            {children}
        </Provider>
    );
}

Store.propTypes = { children: PropTypes.node.isRequired };
