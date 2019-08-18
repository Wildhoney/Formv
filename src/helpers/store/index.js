import id from 'nanoid';

export const initialState = {
    id: id(),
    isLoading: false,
    invalidFields: [],
    validityMessages: {},
    genericMessages: [],
    scrollField: null,
};

const actionTypes = {
    reset: Symbol('formv/reset'),
    isLoading: Symbol('formv/is-loading'),
    invalidFields: Symbol('formv/invalid-fields'),
    validityMessages: Symbol('formv/validity-messages'),
    genericMessages: Symbol('formv/generic-messages'),
    scrollField: Symbol('formv/scroll-field'),
};

export const unboundActions = dispatch => ({
    reset: () => dispatch({ type: actionTypes.reset }),
    isLoading: loading =>
        dispatch({ type: actionTypes.isLoading, payload: loading }),
    setInvalid: payload =>
        dispatch({
            type: actionTypes.invalidFields,
            payload,
        }),
    setValidityMessages: payload =>
        dispatch({ type: actionTypes.validityMessages, payload }),
    setGenericMessages: payload =>
        dispatch({
            type: actionTypes.genericMessages,
            payload: [].concat(payload),
        }),
    setScrollField: payload =>
        dispatch({ type: actionTypes.scrollField, payload }),
});

export function reducer(state, action) {
    switch (action.type) {
        case actionTypes.reset:
            return {
                ...state,
                id: id(),
                invalidFields: [],
                validityMessages: [],
                genericMessages: [],
                scrollField: null,
            };

        case actionTypes.isLoading:
            return { ...state, isLoading: action.payload };

        case actionTypes.invalidFields:
            return { ...state, id: id(), invalidFields: action.payload };

        case actionTypes.validityMessages:
            return { ...state, id: id(), validityMessages: action.payload };

        case actionTypes.genericMessages:
            return { ...state, id: id(), genericMessages: action.payload };

        case actionTypes.scrollField:
            return { ...state, id: id(), scrollField: action.payload };
    }

    return state;
}
