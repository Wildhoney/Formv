import React, {
    useCallback,
    useState,
    useContext,
    useEffect,
    createContext,
} from 'react';
import PropTypes from 'prop-types';
import * as utils from './utils';

const Context = createContext();

const styles = {
    display: 'contents',
};

export { ValidationError } from './utils';

export function Form({
    className,
    noDisable,
    noScroll,
    children,
    onInvalid,
    onSubmit,
    ...props
}) {
    const [form, setForm] = useState(null);
    const [messages, setMessages] = useState({});
    const [highest, setHighest] = useState(null);
    const [isDisabled, setDisabled] = useState(false);
    const handleSubmit = useCallback(
        utils.handleValidation({
            form,
            onInvalid,
            onSubmit,
            setHighest,
            setMessages,
            setDisabled,
        }),
        [form, onInvalid, onSubmit],
    );

    return (
        <Context.Provider value={{ form, messages, highest, noScroll }}>
            <form
                noValidate
                ref={node => node && setForm(node)}
                className={`formv ${className}`.trim()}
                onSubmit={handleSubmit}
                onInvalid={onInvalid}
                {...props}
            >
                <fieldset
                    style={styles}
                    disabled={noDisable ? false : isDisabled}
                >
                    {utils.isFunction(children) ? children(messages) : children}
                </fieldset>
            </form>
        </Context.Provider>
    );
}

Form.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    noDisable: PropTypes.bool,
    noScroll: PropTypes.bool,
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
    onInvalid: () => {},
};

export function Field({ messages, children }) {
    const [field, setField] = useState(null);
    const context = useContext(Context);
    const input = utils.getEncapsulatedField(context.form, field);
    const validityMessages = utils.formatCustomMessages(
        input,
        messages,
        input && context.messages[input.name]
            ? [].concat(context.messages[input.name])
            : [],
    );

    useEffect(() => {
        if (input) {
            input.classList.remove('invalid');
            validityMessages.length > 0 && input.classList.add('invalid');

            !context.noScroll &&
                context.highest === input.name &&
                field.firstChild.scrollIntoView &&
                setTimeout(() =>
                    field.firstChild.scrollIntoView({ behavior: 'smooth' }),
                );
        }
    }, [validityMessages]);

    return (
        <div style={styles} ref={node => node && setField(node)}>
            {utils.isFunction(children) ? (
                children(validityMessages)
            ) : (
                <>
                    {children}

                    {validityMessages.length > 0 && (
                        <ul
                            className={`formv-messages formv-messages-${
                                validityMessages.length > 1
                                    ? 'multiple'
                                    : 'single'
                            }`}
                        >
                            {validityMessages.map((message, index) => (
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
    messages: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

Field.defaultProps = { messages: {} };
