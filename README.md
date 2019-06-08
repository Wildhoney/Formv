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

Formv has a philosophy that it should be easy to opt-out of form validation if and when you want to use another technique in the future. That means not coupling your validation to a particular method, which makes it easily reversible &ndash; that is why Formv comes with only two simple React component &mndash; `Form` and `Field`.

To get started you need to append the form to the DOM. Formv's `Form` component is a plain `form` element that intercepts the `onSubmit` function. We then nest all of our input fields in the `Form` component as you would normally, and encapsulate each field in the `Field` component which simply wraps your form fields with any corresponding validation messages.

```javascript
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
