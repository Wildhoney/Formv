import id from 'nanoid';

export const initialState = {
    id: id(),
    isLoading: false,
    invalidFields: [],
    validityMessages: {},
    genericMessages: [],
};

const actionTypes = {
    reset: Symbol('formv/reset'),
    isLoading: Symbol('formv/is-loading'),
    invalidFields: Symbol('formv/invalid-fields'),
    validityMessages: Symbol('formv/validity-messages'),
    genericMessages: Symbol('formv/generic-messages'),
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
});

export function reducer(state, action) {
    switch (action.type) {
        case actionTypes.reset:
            return {
                ...state,
                id: id(),
                invalidFields: [],
                validityMessages: [],
            };

        case actionTypes.isLoading:
            return { ...state, isLoading: action.payload };

        case actionTypes.invalidFields:
            return { ...state, id: id(), invalidFields: action.payload };

        case actionTypes.validityMessages:
            return { ...state, id: id(), validityMessages: action.payload };

        case actionTypes.genericMessages:
            return { ...state, id: id(), genericMessages: action.payload };
    }

    console.log('::', action);
    return state;
}
