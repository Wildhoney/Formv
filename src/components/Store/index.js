import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { equals } from 'ramda';
import { createContainer } from 'react-tracked';
import * as utils from '../Form/utils';

const useValue = ({ reducer, initialState }) => useReducer(reducer, initialState);

export const { Provider, useTracked, useTrackedState, useSelector } = createContainer(useValue);

export const initialState = {
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

const actionTypes = {
    initialise: Symbol('initialise'),
    dirtyCheck: Symbol('dirty-check'),
    reset: Symbol('reset'),
    submitting: Symbol('submitting'),
    submitted: Symbol('submitted'),
};

export const actions = {
    initialise: (form) => ({
        type: actionTypes.initialise,
        payload: {
            isValid: form.current.checkValidity(),
            meta: { data: utils.getFormData(form.current) },
        },
    }),

    dirtyCheck: (form, currentState) => {
        const newState = utils.getFormData(form.current);

        return {
            type: actionTypes.dirtyCheck,
            payload: {
                isDirty: !equals(newState, currentState),
            },
        };
    },
    reset: (form) => ({
        type: actionTypes.reset,
        payload: { isValid: form.current.checkValidity() },
    }),

    submitting: () => ({ type: actionTypes.submitting }),

    submitted: (validityState) => ({ type: actionTypes.submitted, payload: validityState }),
};

export const reducer = (state, event) => {
    switch (event.type) {
        case actionTypes.initialise:
            return {
                ...state,
                isValid: event.payload.isValid,
                meta: { ...state.meta, data: event.payload.meta.data },
            };

        case actionTypes.dirtyCheck:
            return {
                ...state,
                isDirty: event.payload.isDirty,
            };

        case actionTypes.reset:
            return {
                ...state,
                ...initialState,
                isValid: event.payload.isValid,
                isDirty: event.payload.isDirty,
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
                ...event.payload,
                feedback: {
                    ...state.feedback,
                    ...event.payload.feedback,
                },
                meta: {
                    ...state.meta,
                    ...event.payload.meta,
                    data: event.payload.isValid ? event.payload.meta.data : state.meta.data,
                },
            };
    }

    return state;
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
