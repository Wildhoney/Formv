import React, { useState, useCallback } from 'react';
import delay from 'delay';
import * as fv from 'formv';
import Form from '../Form';
import * as e from './styles';

export default function Layout() {
    const [mockGenericErrors, setMockGenericErrors] = useState(false);
    const [mockValidationErrors, setMockValidationErrors] = useState(false);

    const handleSubmitting = useCallback(state => () => {
        if (state.name.toLowerCase().trim() === 'bot')
            throw new fv.Error.Validation({
                name: 'Bots are not allowed to send messages.',
            });
    });

    const handleSubmitted = useCallback(async () => {
        await delay(2500);

        if (mockGenericErrors) {
            throw new fv.Error.Generic(
                'An unexpected occurred when pretending to send your message.',
            );
        }

        if (!mockGenericErrors && mockValidationErrors) {
            throw new fv.Error.Validation({
                email:
                    'We were unable to validate the supplied e-mail address. Please try again later.',
            });
        }

        return new fv.Success('We have successfully pretended to send your message!');
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

            <Form onSubmitting={handleSubmitting} onSubmitted={handleSubmitted} />
        </e.Container>
    );
}
