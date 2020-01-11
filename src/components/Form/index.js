import React, { useRef, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { useMountedState, useList } from 'react-use';
import PropTypes from 'prop-types';
import * as utils from './utils';
import * as duck from './duck';
import { Context as FormContext } from '../Context';
import { Context as FieldContext } from '../Field';
import { getHighestField } from '../Field/utils';

export default function Form(props) {
    const form = useRef(null);
    const button = useRef(null);
    const isMounted = useMountedState();
    const [state, actions] = utils.useDuck(duck, duck.getInitialState(props));
    const [highestField, setHighestField] = useState(null);
    const [fields, { push: addField }] = useList([]);
    const context = useMemo(() => ({ highestField, addField }), [highestField, addField]);

    // Either use children as-is, or call it as a function passing in the form's state.
    const children = utils.isFunction(props.children) ? props.children(state) : props.children;

    // Setup all of the event listeners passing in the necessary props.
    const handleInvalid = utils.handleInvalid(props);
    const handleClick = utils.handleClick({ button });
    const handleReset = utils.handleReset({ ...props, actions });
    const handleChange = utils.handleChange({ ...props, form, actions });
    const handleSubmit = utils.handleSubmit({
        ...props,
        form,
        button,
        state,
        setHighestField,
        actions,
        isMounted,
    });

    useEffect(
        // Set the state of the initial form validity.
        () => actions.setValidity(form.current.checkValidity()),
        [form],
    );

    useLayoutEffect(() => {
        // Ensure that we want the computation for the highest field to occur.
        if (props.noScroll) return;
        const isInvalidField = state.utils.invalidFields.length > 0;
        if (isInvalidField && !props.noValidate) return;

        // Determine which field is the highest in the DOM.
        setHighestField(
            getHighestField(isInvalidField ? state.utils.invalidFields : fields, !isInvalidField),
        );
    }, [state.utils.id]);

    return (
        <FormContext.Provider value={state}>
            <FieldContext.Provider value={context}>
                <form
                    ref={form}
                    style={utils.getStyles()}
                    noValidate={props.noValidate}
                    onReset={handleReset}
                    onInvalid={handleInvalid}
                    onClick={handleClick}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                >
                    <fieldset
                        disabled={props.noDisable ? false : state.isLoading}
                        style={utils.getStyles()}
                    >
                        {children}
                    </fieldset>
                </form>
            </FieldContext.Provider>
        </FormContext.Provider>
    );
}

Form.propTypes = {
    noScroll: PropTypes.bool,
    noDisable: PropTypes.bool,
    noValidate: PropTypes.bool,
    messages: PropTypes.object,
    dirtyCheck: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onInvalid: PropTypes.func,
    onReset: PropTypes.func,
    onSubmitting: PropTypes.func,
    onSubmitted: PropTypes.func,
};

Form.defaultProps = {
    className: '',
    noScroll: false,
    noDisable: false,
    noValidate: true,
    messages: {},
    dirtyCheck: true,
    children: <></>,
    onInvalid: () => {},
    onReset: () => {},
    onSubmitting: () => {},
    onSubmitted: () => {},
};
