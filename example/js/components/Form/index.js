import React from 'react';
import PropTypes from 'prop-types';
import * as fv from 'formv';
import Input from '../Input';
import Textarea from '../Textarea';
import Field from '../Field';
import * as e from './styles';

export default function Form({ isSubmitting, ...props }) {
    const [state, { set, reset }] = fv.useForm({
        name: '',
        email: '',
        message: '',
    });

    return (
        <e.Container>
            <fv.Form {...props} onSubmitting={props.onSubmitting(state)}>
                <Field
                    messages={{
                        valueMissing: 'Please enter your first name.',
                    }}
                >
                    <Input
                        value={state.name}
                        type="text"
                        name="name"
                        required
                        onChange={set('name')}
                    />
                </Field>

                <Field
                    messages={{
                        valueMissing: 'Please enter your email address.',
                        typeMismatch: 'Please enter a valid email address.',
                    }}
                >
                    <Input
                        value={state.email}
                        type="email"
                        name="email"
                        required
                        onChange={set('email')}
                    />
                </Field>

                <Field
                    messages={{
                        valueMissing: 'Please ensure your message is at least 20 characters.',
                    }}
                >
                    <Textarea
                        value={state.message}
                        name="message"
                        minLength={20}
                        required
                        onChange={set('message')}
                    />
                </Field>

                <e.Buttons>
                    <e.Button type="reset" onClick={reset}>
                        Reset
                    </e.Button>
                    <e.Button type="submit">
                        {isSubmitting ? <>Submitting&hellip;</> : 'Submit'}
                    </e.Button>
                </e.Buttons>
            </fv.Form>
        </e.Container>
    );
}

Form.propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    onSubmitting: PropTypes.func.isRequired,
};
