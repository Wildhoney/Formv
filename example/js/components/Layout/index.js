import React, { useState, useCallback } from 'react';
import { Form, Field } from 'formv';
import * as e from './styles';

export default function Layout() {
    const [success, setSuccess] = useState(false);
    const handleSubmit = useCallback(() => setSuccess(true), []);
    const handleInvalid = useCallback(() => setSuccess(false), []);

    return (
        <e.Container>
            <Form onSubmit={handleSubmit} onInvalid={handleInvalid}>
                <e.Items>
                    {success && (
                        <e.Message>
                            You&apos;ve successfully submitted the form!
                        </e.Message>
                    )}

                    <e.Item>
                        <Field>
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
                        <Field>
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
