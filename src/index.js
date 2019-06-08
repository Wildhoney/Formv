import React, {
    useCallback,
    useRef,
    useState,
    useContext,
    createContext,
} from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';
import * as e from './styles';

const Context = createContext();

export { ValidationError } from './utils';

export function Form({ className, children, onInvalid, onSubmit, ...props }) {
    const formElement = useRef(null);
    const [messages, setMessages] = useState({});
    const [isDisabled, setDisabled] = useState(false);
    const handleSubmit = useCallback(
        utils.handleValidation({
            onInvalid,
            onSubmit,
            formElement,
            setMessages,
            setDisabled,
        }),
        [onInvalid, onSubmit],
    );

    return (
        <Context.Provider value={{ formElement, messages }}>
            <form
                className={`vform ${className}`.trim()}
                noValidate
                ref={formElement}
                onSubmit={handleSubmit}
                {...props}
            >
                <fieldset style={e.fieldStyles} disabled={isDisabled}>
                    {utils.isFunction(children) ? children(messages) : children}
                </fieldset>
            </form>
        </Context.Provider>
    );
}

Form.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    onInvalid: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
};

Form.defaultProps = { className: '', onInvalid: () => {} };

export function Field({ children }) {
    const fieldElement = useRef(null);
    const context = useContext(Context);
    const element = utils.getEncapsulatedField(
        context.formElement,
        fieldElement,
    );
    const messages =
        element && context.messages[element.name]
            ? [].concat(context.messages[element.name])
            : [];

    return (
        <div style={e.fieldStyles} ref={fieldElement}>
            {utils.isFunction(children) ? (
                children(messages)
            ) : (
                <>
                    {children}

                    {messages.length > 0 && (
                        <ul
                            className={`vform-messages vform-messages-${
                                messages.length > 1 ? 'multiple' : 'single'
                            }`}
                        >
                            {messages.map((message, index) => (
                                <li key={`message_${index}`}>{message}</li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

Field.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};
