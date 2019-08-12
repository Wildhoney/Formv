import React, { useState, useCallback } from 'react';
import delay from 'delay';
import * as fv from 'formv';
import Form from '../Form';
import * as e from './styles';

const formStateTypes = {
    idle: Symbol('idle'),
    submitting: Symbol('submitting'),
    submitted: Symbol('submitted'),
};

export default function Layout() {
    const [formState, setFormState] = useState(formStateTypes.idle);
    const [mockErrors, setMockErrors] = useState(false);

    const handleSubmitting = useCallback(() =>
        setFormState(formStateTypes.submitting),
    );
    const handleInvalid = useCallback(() => setFormState(formStateTypes.idle));

    const handleSubmitted = useCallback(async () => {
        await delay(2500);

        if (mockErrors) {
            setFormState(formStateTypes.idle);
            throw new fv.ValidationError({
                email:
                    'We were unable to validate the supplied e-mail address. Please try again later.',
            });
        }

        setFormState(formStateTypes.submitted);
    });

    return (
        <e.Container>
            <e.Image src="/images/logo.png" alt="Formv" />

            <e.Text>
                Try and submit the form below to see how the validation is
                handled by Formv using the browser&apos;s native validation
                capabilities.
            </e.Text>

            <e.Information>
                {!mockErrors && (
                    <e.Text>
                        You can even mock API errors by{' '}
                        <e.Anchor
                            className="enable"
                            onClick={() => setMockErrors(true)}
                        >
                            enabling
                        </e.Anchor>{' '}
                        them which will feed validation errors back into the
                        form when the form passes browser validation.
                    </e.Text>
                )}
                {mockErrors && (
                    <e.Text>
                        You can enable a successful form submission by{' '}
                        <e.Anchor
                            className="disable"
                            onClick={() => setMockErrors(false)}
                        >
                            disabling
                        </e.Anchor>{' '}
                        mock API errors which will cause the form to submit when
                        it passes browser validation.
                    </e.Text>
                )}
            </e.Information>

            {formState === formStateTypes.submitted && (
                <e.Success className="success">
                    We have successfully pretended to send your message!
                </e.Success>
            )}

            <Form
                isSubmitting={formState === formStateTypes.submitting}
                onSubmitting={handleSubmitting}
                onSubmitted={handleSubmitted}
                onInvalid={handleInvalid}
            />
        </e.Container>
    );
}
