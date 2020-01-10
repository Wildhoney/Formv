import React, { useRef } from 'react';
import { useMountedState } from 'react-use';
import PropTypes from 'prop-types';
import * as utils from './utils';
import * as duck from './duck';
import { Context } from '../Context';

export default function Form(props) {
    const form = useRef(null);
    const button = useRef(null);
    const isMounted = useMountedState();
    const [state, actions] = utils.useDuck(duck);

    // Either use children as-is, or call it as a function passing in the form's state.
    const children = utils.isFunction(props.children) ? props.children(state) : props.children;

    // Setup all of the event listeners passing in the necessary props.
    const handleInvalid = utils.handleInvalid({ onInvalid: props.onInvalid });
    const handleSubmit = utils.handleSubmit({ ...props, form, button, state, actions, isMounted });
    const handleClick = utils.handleClick({ button });
    const handleReset = utils.handleReset({ actions, onReset: props.onReset });

    return (
        <Context.Provider value={state}>
            <form
                ref={form}
                style={utils.getStyles()}
                noValidate={props.noValidate}
                onReset={handleReset}
                onInvalid={handleInvalid}
                onClick={handleClick}
                onSubmit={handleSubmit}
            >
                <fieldset
                    disabled={props.noDisable ? false : state.isLoading}
                    style={utils.getStyles()}
                >
                    {children}
                </fieldset>
            </form>
        </Context.Provider>
    );
}

Form.propTypes = {
    noDisable: PropTypes.bool,
    noValidate: PropTypes.bool,
    messages: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onInvalid: PropTypes.func,
    onReset: PropTypes.func,
    onSubmitting: PropTypes.func,
    onSubmitted: PropTypes.func,
};

Form.defaultProps = {
    className: '',
    noDisable: false,
    noValidate: true,
    messages: {},
    children: <></>,
    onInvalid: () => {},
    onReset: () => {},
    onSubmitting: () => {},
    onSubmitted: () => {},
};
