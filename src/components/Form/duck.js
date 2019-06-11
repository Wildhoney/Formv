export const initialState = {
    highestElement: null,
    isDisabled: false,
    messages: {
        generic: [],
        validity: {},
    },
};

export function reducer(state, action) {
    switch (action.type) {

        case 'messages/generic':
        case 'messages/validity':
            const key =
                action.type === 'messages/generic' ? 'generic' : 'validity';
            return {
                ...state,
                highestElement: action.payload.highest,
                messages: { ...state.messages, [key]: action.payload.messages },
            };

        case 'disabled':
            return { ...state, isDisabled: action.payload };

        case 'reset':
            return { ...initialState, isDisabled: true };
    }

    return state;
}
