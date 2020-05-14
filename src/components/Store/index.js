import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { createContainer } from 'react-tracked';

const useValue = ({ reducer, initialState }) => useReducer(reducer, initialState);

export const { Provider, useTracked, useTrackedState, useSelector } = createContainer(useValue);

const initialState = {
    isValid: true,
    isDirty: false,
    isSubmitting: false,
    isSubmitted: false,
    feedback: {
        field: {},
    },
    meta: {
        id: `fv_${nanoid()}`,
        fields: [],
        data: [],
        highest: null,
    },
};

export const actionTypes = {
    initialise: Symbol('initialise'),
    data: Symbol('data'),
    reset: Symbol('reset'),
    submitting: Symbol('submitting'),
    submitted: Symbol('submitted'),
    withDirtyCheck: Symbol('withDirtyCheck'),
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.initialise:
            return {
                ...state,
                isValid: action.payload.isValid,
                meta: { ...state.meta, data: action.payload.meta.data },
            };

        case actionTypes.data:
            return {
                ...state,
                meta: { ...state.meta, data: action.payload.meta.data },
            };

        case actionTypes.reset:
            return {
                ...state,
                ...initialState,
                isValid: action.payload.isValid,
                isDirty: action.payload.isDirty,
                isSubmitted: state.isSubmitted,
            };

        case actionTypes.submitting:
            return {
                ...state,
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
                feedback: {
                    ...state.feedback,
                    ...action.payload.feedback,
                },
                meta: {
                    ...state.meta,
                    ...action.payload.meta,
                },
            };

        case actionTypes.withDirtyCheck:
            return {
                ...state,
                isDirty: action.payload.isDirty,
            };
    }
};

export default function Store({ withDirtyCheck, children }) {
    return (
        <Provider
            reducer={reducer}
            initialState={{ ...initialState, isDirty: withDirtyCheck ? false : null }}
        >
            {children}
        </Provider>
    );
}

Store.propTypes = {
    withDirtyCheck: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};
