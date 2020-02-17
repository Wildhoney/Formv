import React, { forwardRef, useRef, useState, useMemo, useEffect } from 'react';
import { useMountedState, useList, useEffectOnce, useIsomorphicLayoutEffect } from 'react-use';
import PropTypes from 'prop-types';
import * as utils from './utils';
import * as duck from './duck';
import { Context as FormContext } from '../Context';
import { Context as FieldContext } from '../Field';
import { getHighestField } from '../Field/utils';

const Form = forwardRef((props, ref) => {
    const form = useRef(null);
    const button = useRef(null);
    const isMounted = useMountedState();
    const [state, actions] = utils.useDuck(duck, duck.getInitialState(props));
    const [highestField, setHighestField] = useState(null);
    const [fields, { push: addField }] = useList([]);
    const [fieldMessages, { push: setMessages }] = useList([]);
    const messages = utils.mergeMessages(props.messages, fieldMessages);
    const context = useMemo(() => ({ highestField, addField, setMessages }), [
        highestField,
        addField,
        setMessages,
    ]);

    // Apply the forwarded ref if required.
    useEffectOnce(() => {
        ref && typeof ref === 'function' && ref(form);
        ref && 'current' in ref && (ref.current = form);
    }, [form]);

    // Either use children as-is, or call it as a function passing in the form's state.
    const children = utils.isFunction(props.children) ? props.children(state) : props.children;

    // Setup all of the event listeners passing in the necessary props.
    const handleInvalid = utils.handleInvalid(props);
    const handleClick = utils.handleClick({ button });
    const handleReset = utils.handleReset({ ...props, form, actions });
    const handleChange = utils.handleChange({ ...props, form, actions });
    const handleSubmit = utils.handleSubmit({
        ...props,
        form,
        button,
        state,
        setHighestField,
        actions,
        messages,
        isMounted,
    });

    useEffect(
        // Set the state of the initial form validity.
        () => isMounted() && actions.setValidity(form.current.checkValidity()),
        [form],
    );

    useIsomorphicLayoutEffect(() => {
        // Ensure that we want the computation for the highest field to occur.
        if (props.noScroll) return;
        const isInvalidField = state.utils.invalidFields.length > 0;
        if (isInvalidField && !props.noValidate) return;

        // Determine which field is the highest in the DOM.
        isMounted() &&
            setHighestField(
                getHighestField(
                    isInvalidField ? state.utils.invalidFields : fields,
                    !isInvalidField,
                ),
            );
    }, [state.utils.id]);

    return (
        <FormContext.Provider value={state}>
            <form
                ref={form}
                {...utils.sanitiseProps(props)}
                className={props.className}
                style={utils.getStyles()}
                noValidate={props.noValidate}
                onReset={handleReset}
                onInvalid={handleInvalid}
                onClick={handleClick}
                onChange={handleChange}
                onSubmit={handleSubmit}
            >
                <fieldset
                    disabled={props.noDisable ? false : state.isSubmitting}
                    style={utils.getStyles()}
                >
                    <FieldContext.Provider value={context}>{children}</FieldContext.Provider>
                </fieldset>
            </form>
        </FormContext.Provider>
    );
});

Form.propTypes = {
    noScroll: PropTypes.bool,
    noDisable: PropTypes.bool,
    noValidate: PropTypes.bool,
    messages: PropTypes.object,
    className: PropTypes.string,
    dirtyCheck: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onInvalid: PropTypes.func,
    onReset: PropTypes.func,
    onSubmitting: PropTypes.func,
    onSubmitted: PropTypes.func,
};

Form.defaultProps = {
    noScroll: false,
    noDisable: false,
    noValidate: true,
    messages: {},
    className: null,
    dirtyCheck: true,
    children: <></>,
    onInvalid: () => {},
    onReset: () => {},
    onSubmitting: () => {},
    onSubmitted: () => {},
};

export default Form;
