import React, { useState, useCallback } from 'react';
import { Form, Field, ValidationError } from 'formv';
import delay from 'delay';
import * as e from './styles';

export default function Layout() {
    const [success, setSuccess] = useState(false);
    const handleSubmitted = useCallback(async () => {
        if (
            window.confirm('Pretend the API could not validate e-mail address?')
        ) {
            await delay(2500);
            throw new ValidationError({
                emailAddress:
                    'We were unable to validate the supplied e-mail address. Please try again later.',
            });
        }

        await delay(2500);
        setSuccess(true);
    }, []);
    const handleSubmitting = useCallback(() => setSuccess(false), []);

    return (
        <e.Container>
            <Form onSubmit={[handleSubmitting, handleSubmitted]}>
                <e.Items>
                    {success && (
                        <e.Message className="message">
                            You&apos;ve successfully submitted the form!
                        </e.Message>
                    )}

                    <e.Item>
                        <Field
                            messages={{
                                valueMissing: 'Please enter your first name.',
                                tooShort:
                                    'Please ensure your first name is at least 5 characters.',
                            }}
                        >
                            <e.Label htmlFor="contactName">Name:</e.Label>
                            <e.Input
                                type="text"
                                id="contactName"
                                name="contactName"
                                required
                                minLength={5}
                            />
                        </Field>
                    </e.Item>

                    <e.Item>
                        <Field
                            messages={{
                                valueMissing:
                                    'Please enter your email address.',
                                typeMismatch:
                                    'Please enter a valid email address.',
                            }}
                        >
                            <e.Label htmlFor="emailAddress">Email:</e.Label>
                            <e.Input
                                type="email"
                                id="emailAddress"
                                name="emailAddress"
                                required
                            />
                        </Field>
                    </e.Item>

                    <e.Button type="submit">Submit</e.Button>
                </e.Items>
            </Form>
            <e.Global />
        </e.Container>
    );
}
