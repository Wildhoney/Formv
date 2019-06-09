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

export function Form({ className, children, onInvalid, onSubmit, ...props }) {
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
        <Context.Provider value={{ form, messages, highest }}>
            <form
                className={`vform ${className}`.trim()}
                noValidate
                ref={node => node && setForm(node)}
                onSubmit={handleSubmit}
                {...props}
            >
                <fieldset style={styles} disabled={isDisabled}>
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
    onSubmit: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func.isRequired),
    ]).isRequired,
};

Form.defaultProps = { className: '', onInvalid: () => {} };

export function Field({ children }) {
    const [field, setField] = useState(null);
    const context = useContext(Context);
    const input = utils.getEncapsulatedField(context.form, field);
    const messages =
        input && context.messages[input.name]
            ? [].concat(context.messages[input.name])
            : [];

    useEffect(() => {
        if (input) {
            input.classList.remove('invalid');
            messages && input.classList.add('invalid');

            context.highest === input.name &&
                setTimeout(() =>
                    field.firstChild.scrollIntoView({ behavior: 'smooth' }),
                );
        }
    }, [messages]);

    return (
        <div style={styles} ref={node => node && setField(node)}>
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
