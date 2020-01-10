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
    const [state, { set, reset }] = fv.useForm({
        name: '',
        email: '',
        message: '',
    });

    return (
        <fv.Form {...props} messages={utils.getMessages()} onSubmitting={props.onSubmitting(state)}>
            {formState => (
                <>
                    <e.Container>
                        <Messages value={formState.feedback.success} type="success" />
                        <Messages value={formState.feedback.error} type="generic" />

                        <Field>
                            <Input
                                value={state.name}
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
                                name="message"
                                minLength={20}
                                required
                                onChange={set('message')}
                            />
                            <Messages value={formState.feedback.field.message} type="validation" />
                        </Field>

                        <e.Buttons>
                            <e.Button type="reset" onClick={reset}>
                                Reset
                            </e.Button>
                            <e.Button type="submit">
                                {formState.isLoading ? <>Submitting&hellip;</> : 'Submit'}
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

// import { Form } from 'formv';
// import Input from './components/Input';
// import Field from './components/Field';
// import Button from './components/Button';
// import Errors from './components/Errors';
// import Success from './components/Success';

// function getMessages() {
//     return {
//         name: {
//             valueMissing: 'Please enter your first and last name.',
//         },
//         email: {
//             valueMissing: 'Please enter your email address.',
//             typeMismatch: 'Please enter a valid email address.',
//         },
//         age: {
//             valueMissing: 'Please enter your age.',
//             rangeUnderflow: 'You must be 18 or over to use this form.',
//         },
//     };
// }

// export default function MyForm() {
//     const handleSubmitting = () => {};
//     const handleSubmitted = () => {};

//     return (
//         <Form
//             messages={getMessages()}
//             onSubmitting={handleSubmitting}
//             onSubmitted={handleSubmitted}
//         >
//             {formState => {
//                 return (
//                     <>
//                         <Success messages={formState.success} />

//                         <Field>
//                             <Input type="text" name="name" required />
//                             <Errors messages={formState.error.name} />
//                         </Field>

//                         <Field>
//                             <Input type="email" name="email" required />
//                             <Errors messages={formState.error.email} />
//                         </Field>

//                         <Field>
//                             <Input name="age" required min={18} />
//                             <Errors messages={formState.error.age} />
//                         </Field>

//                         <Button type="submit">Submit</Button>
//                     </>
//                 );
//             }}
//         </Form>
//     );
// }
