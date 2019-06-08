import React, { useState, useCallback } from 'react';
import { Form, Field, ValidationError } from 'formv';
import * as e from './styles';

export default function Layout() {
    const [success, setSuccess] = useState(false);
    const handleSubmit = useCallback(() => setSuccess(true), []);

    return (
        <e.Container>
            <Form onSubmit={handleSubmit}>
                {success && (
                    <e.Message>
                        You&apos;ve successfully submitted the form!
                    </e.Message>
                )}

                <e.Item>
                    <Field>
                        <label htmlFor="contactName">Name:</label>
                        <input
                            type="text"
                            id="contactName"
                            name="contactName"
                            required
                            minLength={5}
                        ></input>
                    </Field>
                </e.Item>

                <e.Item>
                    <Field>
                        <label htmlFor="emailAddress">Email:</label>
                        <input
                            type="email"
                            id="emailAddress"
                            name="emailAddress"
                            required
                        />
                    </Field>
                </e.Item>

                <button type="submit">Send</button>
            </Form>
        </e.Container>
    );
}
