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
            {...props}
            withDirtyCheck
            messages={utils.getMessages()}
            onSubmitting={props.onSubmitting(state)}
        >
            {({ isSubmitting, feedback }) => (
                <>
                    <e.Container>
                        <Messages value={feedback.success} type="success" />

                        <Messages value={feedback.error} type="generic" />

                        <Field>
                            <Input
                                value={state.name}
                                className={feedback.field.name && 'invalid'}
                                readOnly={isSubmitting}
                                type="text"
                                name="name"
                                required
                                onChange={set('name')}
                            />
                            <Messages value={feedback.field.name} type="validation" />
                        </Field>

                        <Field>
                            <Input
                                value={state.email}
                                className={feedback.field.email && 'invalid'}
                                readOnly={isSubmitting}
                                type="email"
                                name="email"
                                required
                                onChange={set('email')}
                            />
                            <Messages value={feedback.field.email} type="validation" />
                        </Field>

                        <Field>
                            <Textarea
                                value={state.message}
                                className={feedback.field.message && 'invalid'}
                                readOnly={isSubmitting}
                                name="message"
                                required
                                onChange={set('message')}
                            />
                            <Messages value={feedback.field.message} type="validation" />
                        </Field>

                        <e.Buttons>
                            <e.Button type="reset" disabled={isSubmitting} onClick={reset}>
                                Reset
                            </e.Button>

                            <e.Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <>Submitting&hellip;</> : 'Submit'}
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
    onSubmitted: PropTypes.func.isRequired,
};
