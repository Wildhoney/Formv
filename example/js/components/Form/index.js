import React from 'react';
import PropTypes from 'prop-types';
import * as fv from 'formv';
import Input from '../Input';
import Textarea from '../Textarea';
import Field from '../Field';
import Messages from '../Messages';
import * as e from './styles';
import * as utils from './utils';

export default function Form({ ...props }) {
    const [state, { set, reset }] = fv.useMap({
        name: '',
        email: '',
        message: '',
    });

    return (
        <fv.Form
            dirtyCheck
            {...props}
            messages={utils.getMessages()}
            onSubmitting={props.onSubmitting(state)}
        >
            {(formState) => (
                <>
                    <e.Container>
                        <Messages value={formState.feedback.success} type="success" />

                        <Messages value={formState.feedback.error} type="generic" />

                        <Field>
                            <Input
                                value={state.name}
                                className={formState.feedback.field.name && 'invalid'}
                                readOnly={formState.isSubmitting}
                                type="text"
                                name="name"
                                required
                                onChange={set('name')}
                            />
                            <Messages value={formState.feedback.field.name} type="validation" />
                        </Field>

                        <Field>
                            <Input
                                value={state.email}
                                className={formState.feedback.field.email && 'invalid'}
                                readOnly={formState.isSubmitting}
                                type="email"
                                name="email"
                                required
                                onChange={set('email')}
                            />
                            <Messages value={formState.feedback.field.email} type="validation" />
                        </Field>

                        <Field>
                            <Textarea
                                value={state.message}
                                className={formState.feedback.field.message && 'invalid'}
                                readOnly={formState.isSubmitting}
                                name="message"
                                required
                                onChange={set('message')}
                            />
                            <Messages value={formState.feedback.field.message} type="validation" />
                        </Field>

                        <e.Buttons>
                            <e.Button
                                type="reset"
                                disabled={formState.isSubmitting}
                                onClick={reset}
                            >
                                Reset
                            </e.Button>

                            <e.Button type="submit" disabled={formState.isSubmitting}>
                                {formState.isSubmitting ? <>Submitting&hellip;</> : 'Submit'}
                            </e.Button>
                        </e.Buttons>
                    </e.Container>
                </>
            )}
        </fv.Form>
    );
}

Form.propTypes = {
    onSubmitting: PropTypes.func.isRequired,
};
