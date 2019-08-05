import React from 'react';
import { useMap } from 'react-use';
import PropTypes from 'prop-types';
import * as fv from 'formv';
import Input from '../Input';
import Textarea from '../Textarea';
import Field from '../Field';
import * as e from './styles';

export default function Form({ isSubmitting, ...props }) {
    const [state, { set: setField, reset: resetFields }] = useMap({
        name: '',
        email: '',
        message: '',
    });

    return (
        <fv.Form {...props}>
            <e.Container>
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
                        onChange={({ target }) =>
                            setField('name', target.value)
                        }
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
                        onChange={({ target }) =>
                            setField('email', target.value)
                        }
                    />
                </Field>

                <Field
                    messages={{
                        valueMissing:
                            'Please ensure your message is at least 20 characters.',
                    }}
                >
                    <Textarea
                        value={state.message}
                        name="message"
                        minLength={20}
                        required
                        onChange={({ target }) =>
                            setField('message', target.value)
                        }
                    />
                </Field>

                <e.Buttons>
                    <e.Button type="reset" onClick={resetFields}>
                        Reset
                    </e.Button>
                    <e.Button type="submit">
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </e.Button>
                </e.Buttons>
            </e.Container>
        </fv.Form>
    );
}

Form.propTypes = { isSubmitting: PropTypes.bool.isRequired };
