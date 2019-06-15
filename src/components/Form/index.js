import React, {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useReducer,
    createContext,
} from 'react';
import PropTypes from 'prop-types';
import Messages from '../Messages';
import * as utils from './utils';
import { reducer, initialState } from './duck';

export const Context = createContext();

export { GenericError, ValidationError } from './utils';

const styles = {
    display: 'var(--formv-fieldset-display, contents)',
};

export default function Form({
    noScroll,
    noDisable,
    children,
    onInvalid,
    onSubmit,
    ...props
}) {
    const form = useRef('abc');
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSubmit = useCallback(
        utils.handleFormValidation({
            form,
            onInvalid,
            onSubmit,
            ...state,
            dispatch,
        }),
        [form, onInvalid, onSubmit],
    );

    useEffect(() => utils.handleScroll(form, state, noScroll), [
        state.highestElement,
        state.messages.validity,
    ]);

    return (
        <Context.Provider value={{ ...state, form, noScroll }}>
            <form
                ref={form}
                noValidate
                className={utils.getClassNames(props.className)}
                onSubmit={handleSubmit}
                onInvalid={onInvalid}
                {...props}
            >
                <fieldset
                    style={styles}
                    disabled={noDisable ? false : state.isDisabled}
                >
                    <Messages
                        className="generic"
                        values={[].concat(state.messages.generic)}
                    />

                    {typeof children === 'function'
                        ? children(state.messages.validity)
                        : children}
                </fieldset>
            </form>
        </Context.Provider>
    );
}

Form.propTypes = {
    className: PropTypes.string,
    noDisable: PropTypes.bool,
    noScroll: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onInvalid: PropTypes.func,
    onSubmit: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func.isRequired),
    ]).isRequired,
};

Form.defaultProps = {
    className: '',
    noDisable: false,
    noScroll: false,
    children: <Fragment />,
    onInvalid: () => {},
};
