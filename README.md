# Formv

> React form validation using the validation native to all recent browsers. Also includes support for handling API validation messages.

![Travis](http://img.shields.io/travis/Wildhoney/Formv.svg?style=for-the-badge)
&nbsp;
![npm](http://img.shields.io/npm/v/formv.svg?style=for-the-badge)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=for-the-badge)
&nbsp;
![Coveralls](https://img.shields.io/coveralls/Wildhoney/Formv.svg?style=for-the-badge)
&nbsp;
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

---

## Getting Started

Formv utilises the native [form validation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation) which is built-in to all recent browsers &ndash; as such, all validation rules are set on the relevant form fields using `required`, `pattern`, `minLength`, etc...

Formv has a philosophy that it should be easy to opt-out of form validation if and when you want to use another technique in the future. That means not coupling your validation to a particular method, which makes it easily reversible &ndash; that is why Formv comes with only two simple React component &ndash; `Form` and `Field`.

To get started you need to append the form to the DOM. Formv's `Form` component is a plain `form` element that intercepts the `onSubmit` function. We then nest all of our input fields in the `Form` component as you would normally, and encapsulate each field in the `Field` component which simply wraps your form fields with any corresponding validation messages.

```jsx
import { Form, Field } from 'formv';

export default function MyForm() {
    return (
        <Form onSubmit={handleSubmit}>

            <Field>
                <input type="text" name="firstName" required />
            </Field>

            <Field>
                <input type="email" name="emailAddress" required />
            </Field>

            <button type="submit">Send Enquiry</button>

        </Form>
    );
}
```

Voila! Using the above code you now have everything you need to validate your form. By clicking the `button` all validation rules will be checked, and if you've not filled in the `firstName` field, or the `emailAddress` field is either missing or an invalid e-mail address, you'll see validation messages appear next to the relevant field.

> Note that you may also pass an array of functions (`[handleSubmitting, handleSubmitted]`) to `onSubmit` &ndash; the first would **always** be invoked upon every submission, and the second would be invoked only upon passing validation.

## Handling API Validation

It's all good and well having the front-end validation for your forms, however there are always cases where the front-end validation passes just fine, whereas the back-end throws a validtion error &ndash; maybe the username is already taken, for instance. In those cases we need to feed the API validation messages back into the `Form` component by using the `ValidationError` exception that Formv exports.

The validation messages need to be flattened and should map to your field names &ndash; for cases where you have an array of fields, we recommend you name these `names.0.firstName`, `names.1.firstName`, etc...

Continuing from the above example, we'll implement the `handleSubmit` function which handles the submitting of the data to the API.

```javascript
import { ValidationError } from 'formv';

async function handleSubmit() {

    try {

        // Attempt to send the data to our API endpoint.
        await api.post('/contact', data);

    } catch (error) {

        const failedValidation = error.response.status === 400;

        if (failedValidation) {

            // Feed the validation errors back into Formv.
            throw new ValidationError(error.response.data);

        }

        // Handle other error messages gracefully.
    }

}
```

## Custom Validation Messages

You'll find that validation messages differ between browsers, which means your native messages are inconsistent. With Formv you are able to pass a `messages` prop to the `Field` component which is a map of [the `ValidityState` object](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState). In our above example if we want to be more descriptive when the user forgets to enter their first name, we can do that with `messages` by supplying the `valueMissing` item &ndash; for the email field we'll also add the `typeMismatch` which indicates the email address is invalid.

```jsx
import { Form, Field } from 'formv';

export default function MyForm() {
    return (
        <Form onSubmit={handleSubmit}>

            <Field messages={{ valueMissing: 'Please enter your first name.' }}>
                <input type="text" name="firstName" required />
            </Field>
            
            <Field
                messages={{
                    valueMissing: 'Please enter your email address.',
                    typeMismatch: 'Please enter a valid email address.'
                }}
            >
                <input type="email" name="emailAddress" required />
            </Field>

            <button type="submit">Send Enquiry</button>

        </Form>
    );
}
```

> Note that the custom validaiton messages are **only** applicable to front-end validation &ndash; when you feed API validation messages back into Formv the wording of the messages is the responsibility of the back-end. At the very least messages should be corrected using front-end find and replace if the back-end cannot be changed.
