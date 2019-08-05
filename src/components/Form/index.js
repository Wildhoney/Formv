import React, {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
    useReducer,
    createContext,
    forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import id from 'nanoid';
import Messages from '../Messages';
import * as utils from './utils';
import { reducer, initialState } from './duck';

export const Context = createContext();

export { GenericError, ValidationError } from './utils';

const styles = {
    display: 'var(--formv-fieldset-display, contents)',
};

const Form = forwardRef(function Form(
    { noScroll, noDisable, children, onInvalid, onSubmit, ...props },
    ref,
) {
    const form = useRef();
    const [hash, setHash] = useState(id());
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleRef = useCallback(
        node => {
            if (node) {
                form.current = node;
                ref && typeof ref === 'function' && ref(node);
                ref && 'current' in ref && (ref.current = node);
            }
        },
        [form.current],
    );

    const handleSubmit = useCallback(
        utils.handleFormValidation({
            form,
            setHash,
            onInvalid,
            onSubmit,
            ...state,
            dispatch,
        }),
        [form, onInvalid, onSubmit],
    );

    const handleReset = useCallback(
        () => (dispatch({ type: 'reset', payload: false }), setHash(id())),
    );

    useEffect(() => utils.handleScroll(form, state, noScroll), [
        state.highestElement,
        state.messages.validity,
    ]);

    return (
        <Context.Provider value={{ ...state, form, hash, noScroll }}>
            <form
                ref={handleRef}
                noValidate
                className={utils.getClassNames(props.className)}
                onSubmit={handleSubmit}
                onReset={handleReset}
                onInvalid={onInvalid}
                {...props}
            >
                <fieldset
                    style={styles}
                    disabled={noDisable ? false : state.isDisabled}
                >
                    <Messages
                        className="generic"
                        hash={hash}
                        values={[].concat(state.messages.generic)}
                    />

                    {typeof children === 'function'
                        ? children(state.messages.validity)
                        : children}
                </fieldset>
            </form>
        </Context.Provider>
    );
});

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

export default Form;
