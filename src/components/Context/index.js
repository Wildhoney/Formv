import { createContext } from 'react';
import id from 'nanoid';

export const defaultState = {
    isLoading: false,
    isValid: null,
    feedback: {
        error: null,
        success: null,
        field: {},
    },
    utils: {
        id: id(),
        invalidFields: [],
    },
};

export const Context = createContext(defaultState);