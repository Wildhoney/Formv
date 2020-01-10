import * as feedback from './helpers/feedback';

export { default as Form } from './components/Form';

export { Context } from './components/Context';

export { default as useForm } from './helpers/hook';

export const Error = {
    Generic: feedback.FormvGenericError,
    Validation: feedback.FormvValidationError,
};

export const Success = feedback.FormvSuccess;
