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
    const [mockGenericErrors, setMockGenericErrors] = useState(false);
    const [mockValidationErrors, setMockValidationErrors] = useState(false);

    const handleSubmitting = useCallback(() => setFormState(formStateTypes.submitting));
    const handleInvalid = useCallback(() => setFormState(formStateTypes.idle));

    const handleSubmitted = useCallback(async () => {
        await delay(2500);

        if (mockGenericErrors) {
            setFormState(formStateTypes.idle);
            throw new fv.Error.Generic(
                'An unexpected occurred when pretending to send your message.',
            );
        }

        if (!mockGenericErrors && mockValidationErrors) {
            setFormState(formStateTypes.idle);
            throw new fv.Error.Validation({
                email:
                    'We were unable to validate the supplied e-mail address. Please try again later.',
            });
        }

        setFormState(formStateTypes.submitted);

        return new fv.Success(
            (
                <e.Success className="success">
                    We have successfully pretended to send your message!
                </e.Success>
            ),
        );
    });

    return (
        <e.Container>
            <e.Image src="/images/logo.png" alt="Formv" />

            <e.Text>
                Try and submit the form below to see how the validation is handled by Formv using
                the browser&apos;s native validation capabilities.
            </e.Text>

            <e.Information>
                <e.Text>
                    {!mockValidationErrors && (
                        <>
                            You can even mock API validation errors by{' '}
                            <e.Anchor
                                className="enable api"
                                onClick={() => setMockValidationErrors(true)}
                            >
                                enabling
                            </e.Anchor>{' '}
                            them which will feed validation errors back into the form when the form
                            passes browser validation.
                        </>
                    )}
                    {mockValidationErrors && (
                        <>
                            You can enable a successful form submission by{' '}
                            <e.Anchor
                                className="disable api"
                                onClick={() => setMockValidationErrors(false)}
                            >
                                disabling
                            </e.Anchor>{' '}
                            mock API errors which will cause the form to submit when it passes
                            browser validation.
                        </>
                    )}{' '}
                    Formv also supports handling generic messages which you can{' '}
                    <e.Anchor
                        className="enable generic"
                        onClick={() => setMockGenericErrors(!mockGenericErrors)}
                    >
                        {mockGenericErrors ? 'disable' : 'enable'}
                    </e.Anchor>
                    .
                </e.Text>
            </e.Information>

            <Form
                isSubmitting={formState === formStateTypes.submitting}
                onSubmitting={handleSubmitting}
                onSubmitted={handleSubmitted}
                onInvalid={handleInvalid}
            />
        </e.Container>
    );
}
