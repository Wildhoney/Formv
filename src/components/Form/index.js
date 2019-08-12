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
import { reducer, initialState, unboundActions } from '../../helpers/store';
import Messages from '../Messages';
import * as utils from './utils';

export const Context = createContext();

// export { GenericError, ValidationError } from './utils';

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
                    {/* <Messages
                        className="generic"
                        hash={hash}
                        values={[].concat(state.messages.generic)}
                    /> */}
                    {children}
                </fieldset>
            </form>
        </Context.Provider>
    );
}

// const Form = forwardRef(function Form(
//     {
//         noScroll,
//         noDisable,
//         children,
//         onInvalid,
//         onSubmitting,
//         onSubmitted,
//         onReset,
//         ...props
//     },
//     ref,
// ) {
//     const form = useRef();
//     const [hash, setHash] = useState(id());
//     const [state, dispatch] = useReducer(reducer, initialState);

//     const handleRef = useCallback(
//         node => {
//             if (node) {
//                 form.current = node;
//                 ref && typeof ref === 'function' && ref(node);
//                 ref && 'current' in ref && (ref.current = node);
//             }
//         },
//         [form.current],
//     );

//     const handleSubmit = useCallback(
//         utils.handleFormValidation({
//             form,
//             setHash,
//             onInvalid,
//             onSubmitting,
//             onSubmitted,
//             dispatch,
//             ...state,
//         }),
//         [form, onInvalid, onSubmitting, onSubmitted],
//     );

//     const handleReset = useCallback(event => {
//         dispatch({ type: 'reset', payload: false });
//         setHash(id());
//         onReset(event);
//     });

//     useEffect(() => utils.handleScroll(form, state, noScroll), [
//         state.highestElement,
//         state.messages.validity,
//     ]);

//     return (
//         <Context.Provider value={{ ...state, form, hash, noScroll }}>
//             <form
//                 ref={handleRef}
//                 noValidate
//                 className={utils.getClassNames(props.className)}
//                 onReset={handleReset}
//                 onInvalid={onInvalid}
//                 onSubmit={handleSubmit}
//                 {...props}
//             >
//                 <fieldset
//                     style={styles}
//                     disabled={noDisable ? false : state.isDisabled}
//                 >
//                     <Messages
//                         className="generic"
//                         hash={hash}
//                         values={[].concat(state.messages.generic)}
//                     />

//                     {typeof children === 'function'
//                         ? children(state.messages.validity)
//                         : children}
//                 </fieldset>
//             </form>
//         </Context.Provider>
//     );
// });

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
    children: <Fragment />,
    onInvalid: () => {},
    onReset: () => {},
    onSubmitting: () => {},
    onSubmitted: () => {},
};

// export default Form;
