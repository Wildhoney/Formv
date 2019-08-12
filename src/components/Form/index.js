import React, { useState, useReducer, createContext } from 'react';
import PropTypes from 'prop-types';
import { reducer, initialState, unboundActions } from '../../helpers/store';
import Messages from '../Messages';
import * as utils from './utils';

export const Context = createContext();

export default function Form({ children, ...props }) {
    // Hold a reference to the form element.
    const [form, setForm] = useState(null);

    // Bind to the reducer to manage the form's state.
    const [store, dispatch] = useReducer(reducer, initialState);
    const actions = unboundActions(dispatch);
    const augmentedProps = { ...props, store, form, actions };

    // Setup the event handlers for the form element.
    const handleSubmit = utils.handleSubmit(augmentedProps);
    const handleReset = utils.handleReset(augmentedProps);
    const handleInvalid = utils.handleInvalid(augmentedProps);

    // Used to scroll to the first invalid element.
    // utils.handleScroll();

    return (
        <Context.Provider value={augmentedProps}>
            <form
                ref={setForm}
                style={{ display: 'contents' }}
                noValidate={props.noValidate}
                onReset={handleReset}
                onInvalid={handleInvalid}
                onSubmit={handleSubmit}
            >
                <fieldset
                    style={{ display: 'contents' }}
                    disabled={props.noDisable ? false : store.isLoading}
                >
                    {store.genericMessages.length > 0 && (
                        <Messages
                            id={store.id}
                            genericMessages={store.genericMessages}
                        />
                    )}

                    {children}
                </fieldset>
            </form>
        </Context.Provider>
    );
}

Form.propTypes = {
    className: PropTypes.string,
    noDisable: PropTypes.bool,
    noScroll: PropTypes.bool,
    noValidate: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onInvalid: PropTypes.func,
    onReset: PropTypes.func,
    onSubmitting: PropTypes.func,
    onSubmitted: PropTypes.func,
};

Form.defaultProps = {
    className: '',
    noDisable: false,
    noScroll: false,
    noValidate: true,
    children: <></>,
    onInvalid: () => {},
    onReset: () => {},
    onSubmitting: () => {},
    onSubmitted: () => {},
};
