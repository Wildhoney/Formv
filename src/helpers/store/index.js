import id from 'nanoid';

export const initialState = {
    id: id(),
    isLoading: false,
    invalidFields: [],
};

const actionTypes = {
    reset: Symbol('formv/reset'),
    isLoading: Symbol('formv/is-loading'),
    invalidFields: Symbol('formv/invalid-fields'),
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
});

export function reducer(state, action) {
    switch (action.type) {
        case actionTypes.reset:
            return { ...state, id: id(), invalidFields: [] };

        case actionTypes.isLoading:
            return { ...state, isLoading: action.payload };

        case actionTypes.invalidFields:
            return { ...state, id: id(), invalidFields: action.payload };
    }

    console.log('::', action);
    return state;
}
