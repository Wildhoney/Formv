import id from 'nanoid';
import { defaultState } from '../Context';

const actionTypes = {
    id: Symbol('id'),
    reset: Symbol('reset'),
    loading: Symbol('loading'),
    invalidFields: Symbol('invalid-fields'),
    messages: {
        success: Symbol('success'),
        generic: Symbol('generic'),
        validity: Symbol('validity'),
    },
};

export const initialState = defaultState;

export function bindActions(dispatch) {
    return {
        id: () => dispatch({ type: actionTypes.id }),
        reset: () => dispatch({ type: actionTypes.reset }),
        isLoading: isLoading => dispatch({ type: actionTypes.loading, payload: { isLoading } }),
        setInvalidFields: fields =>
            dispatch({ type: actionTypes.invalidFields, payload: { fields } }),
        setSuccessMessages: message =>
            dispatch({ type: actionTypes.messages.success, payload: { message } }),
        setGenericMessages: message =>
            dispatch({ type: actionTypes.messages.generic, payload: { message } }),
        setValidityMessages: messages =>
            dispatch({ type: actionTypes.messages.validity, payload: { messages } }),
    };
}

export function reducer(state, event) {
    switch (event.type) {
        case actionTypes.reset: {
            return { ...defaultState, utils: { ...defaultState.utils, id: state.utils.id } };
        }
        case actionTypes.id: {
            return { ...state, utils: { ...state.utils, id: id() } };
        }
        case actionTypes.loading: {
            return { ...state, isLoading: event.payload.isLoading };
        }
        case actionTypes.invalidFields: {
            return {
                ...state,
                utils: { ...state.utils, invalidFields: event.payload.fields },
            };
        }
        case actionTypes.messages.success: {
            return {
                ...state,
                isValid: true,
                feedback: { ...state.feedback, success: event.payload.message },
            };
        }
        case actionTypes.messages.generic: {
            return {
                ...state,
                isValid: false,
                feedback: { ...state.feedback, error: event.payload.message },
            };
        }
        case actionTypes.messages.validity: {
            return {
                ...state,
                isValid: false,
                feedback: { ...state.feedback, field: event.payload.messages },
            };
        }
    }

    return state;
}
