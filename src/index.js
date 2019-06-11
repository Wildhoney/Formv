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

export { GenericError, ValidationError } from './utils';

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
    const [genericMessages, setGenericMessages] = useState([]);
    const [validityMessages, setValidityMessages] = useState({});
    const [highest, setHighest] = useState(null);
    const [isDisabled, setDisabled] = useState(false);

    const handleSubmit = useCallback(
        utils.handleValidation({
            form,
            onInvalid,
            onSubmit,
            setHighest,
            setGenericMessages,
            setValidityMessages,
            setDisabled,
        }),
        [form, onInvalid, onSubmit],
    );

    useEffect(() => {
        !noScroll &&
            highest &&
            highest === form &&
            form.scrollIntoView &&
            setTimeout(() => form.scrollIntoView({ behavior: 'smooth' }));
    }, [highest, validityMessages]);

    return (
        <Context.Provider value={{ form, validityMessages, highest, noScroll }}>
            <form
                noValidate
                ref={node => node && setForm(node)}
                className={`formv ${className}`.trim()}
                onSubmit={handleSubmit}
                onInvalid={onInvalid}
                {...props}
            >
                <fieldset
                    style={{
                        display: 'var(--formv-fieldset-display, contents)',
                    }}
                    disabled={noDisable ? false : isDisabled}
                >
                    <Messages className="generic" values={genericMessages} />
                    {utils.isFunction(children)
                        ? children(validityMessages)
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
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
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

export function Field({ messages, className, children }) {
    const [field, setField] = useState(null);
    const context = useContext(Context);
    const input = utils.getEncapsulatedField(context.form, field);
    const validityMessages = utils.formatCustomMessages(
        input,
        messages,
        input && context.validityMessages[input.name]
            ? [].concat(context.validityMessages[input.name])
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
        <div
            className={`formv-field ${className}`.trim()}
            style={{ display: 'var(--formv-field-display, contents)' }}
            ref={node => node && setField(node)}
        >
            {utils.isFunction(children) ? children(validityMessages) : children}
            <Messages className="validity" values={validityMessages} />
        </div>
    );
}

Field.propTypes = {
    messages: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

Field.defaultProps = { messages: {}, className: '' };

function Messages({ values, className }) {
    return values.length === 0 ? null : (
        <ul
            className={`formv-messages formv-messages-${className} formv-messages-${
                values.length > 1 ? 'multiple' : 'single'
            }`}
        >
            {values.map((message, index) => (
                <li key={`message_${index}`}>{message}</li>
            ))}
        </ul>
    );
}

Messages.propTypes = {
    values: PropTypes.array.isRequired,
    className: PropTypes.string,
};

Messages.defaultProps = { values: [], className: '' };
