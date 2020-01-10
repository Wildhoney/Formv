import { createContext } from 'react';

export const defaultState = {
    isLoading: false,
    isValid: null,
    feedback: {
        error: null,
        success: null,
        field: {},
    },
};

export const Context = createContext(defaultState);
