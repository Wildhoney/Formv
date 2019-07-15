import React from 'react';
import PropTypes from 'prop-types';
import * as fv from 'formv';
import Input from '../Input';
import Textarea from '../Textarea';
import Field from '../Field';
import * as e from './styles';

export default function Form({ isSubmitting, ...props }) {
    return (
        <fv.Form {...props}>
            <e.Container>
                <Field
                    messages={{
                        valueMissing: 'Please enter your first name.',
                    }}
                >
                    <Input type="text" name="name" required />
                </Field>

                <Field
                    messages={{
                        valueMissing: 'Please enter your email address.',
                        typeMismatch: 'Please enter a valid email address.',
                    }}
                >
                    <Input type="email" name="email" required />
                </Field>

                <Field
                    messages={{
                        valueMissing:
                            'Please ensure your message is at least 20 characters.',
                    }}
                >
                    <Textarea name="message" minLength={20} required />
                </Field>

                <e.Button type="submit">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </e.Button>
            </e.Container>
        </fv.Form>
    );
}

Form.propTypes = { isSubmitting: PropTypes.bool.isRequired };
