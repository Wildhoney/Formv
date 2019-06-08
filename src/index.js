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

export function Form({ className, children, onSubmit, ...props }) {
    const formElement = useRef(null);
    const [messages, setMessages] = useState({});
    const [isDisabled, setDisabled] = useState(false);
    const handleSubmit = useCallback(
        utils.handleValidation({
            onSubmit,
            formElement,
            setMessages,
            setDisabled,
        }),
        [],
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
                <e.Fieldset disabled={isDisabled}>{children}</e.Fieldset>
            </form>
        </Context.Provider>
    );
}

Form.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

Form.defaultProps = { className: '' };

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
        <e.Field ref={fieldElement}>
            {children}

            {messages.length > 0 && (
                <e.Messages
                    className="vform-messages"
                    isMultiple={messages.length > 1}
                >
                    {messages.map((message, index) => (
                        <e.Message key={`message_${index}`}>
                            {message}
                        </e.Message>
                    ))}
                </e.Messages>
            )}
        </e.Field>
    );
}

Field.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};
