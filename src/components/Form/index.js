import React, { useState, useReducer, useRef, createContext } from 'react';
import PropTypes from 'prop-types';
import { reducer, initialState, unboundActions } from '../../helpers/store';
import Messages from '../Messages';
import * as utils from './utils';

export const Context = createContext();

export default function Form({ children, ...props }) {
    // Hold a reference to the form element and the clicked button.
    const button = useRef(null);
    const [form, setForm] = useState(null);

    // Bind to the reducer to manage the form's state.
    const [store, dispatch] = useReducer(reducer, initialState);
    const actions = unboundActions(dispatch);
    const augmentedProps = { ...props, store, form, button, actions };

    // Setup the event handlers for the form element.
    const handleSubmit = utils.handleSubmit(augmentedProps);
    const handleReset = utils.handleReset(augmentedProps);
    const handleInvalid = utils.handleInvalid(augmentedProps);
    const handleClick = utils.handleClick(augmentedProps);

    return (
        <Context.Provider value={augmentedProps}>
            <form
                ref={setForm}
                style={utils.getStyles(props.legacy)}
                className={`formv ${props.className}`.trim()}
                noValidate={props.noValidate}
                onReset={handleReset}
                onInvalid={handleInvalid}
                onClick={handleClick}
                onSubmit={handleSubmit}
            >
                <fieldset
                    style={utils.getStyles(props.legacy)}
                    disabled={props.noDisable ? false : store.isLoading}
                >
                    {store.successMessage && (
                        <Messages
                            id={store.id}
                            noScroll={props.noScroll}
                            className="formv-messages-success"
                            successMessage={store.successMessage}
                        />
                    )}

                    {store.genericMessages.length > 0 && (
                        <Messages
                            id={store.id}
                            noScroll={props.noScroll}
                            className="formv-messages-error-generic"
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
    legacy: PropTypes.bool,
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
    legacy: false,
    noDisable: false,
    noScroll: false,
    noValidate: true,
    children: <></>,
    onInvalid: () => {},
    onReset: () => {},
    onSubmitting: () => {},
    onSubmitted: () => {},
};
