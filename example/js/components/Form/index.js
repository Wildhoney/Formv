import React from 'react';
import { useMap } from 'react-use';
import PropTypes from 'prop-types';
import * as fv from 'formv';
import Input from '../Input';
import Textarea from '../Textarea';
import Field from '../Field';
import * as e from './styles';

export default function Form({ isSubmitting, ...props }) {
    const [state, { set, reset }] = useMap({
        name: '',
        email: '',
        message: '',
    });

    const customValidation = () => {
        if (state.name.toLowerCase() === 'bot')
            throw new fv.ValidationError({
                name: 'Bots are not allowed to send messages.',
            });
    };

    return (
        <e.Container>
            <fv.Form {...props} onValidate={customValidation}>
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
                        onChange={({ target }) => set('name', target.value)}
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
                        onChange={({ target }) => set('email', target.value)}
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
                        onChange={({ target }) => set('message', target.value)}
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

Form.propTypes = { isSubmitting: PropTypes.bool.isRequired };
