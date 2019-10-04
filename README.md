<img src="example/images/logo.png" alt="Formv" width="150px" />

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

Formv has a philosophy that it should be easy to opt-out of form validation if and when you want to use another technique in the future. That means not coupling your validation to a particular method, which makes it easily reversible &ndash; that is why Formv comes with only two simple React components &ndash; `Form` and `Field`.

To get started you need to append the form to the DOM. Formv's `Form` component is a plain `form` element that intercepts the `onSubmit` function. We then nest all of our input fields in the `Form` component as you would normally, and encapsulate each field in the `Field` component which simply wraps your form fields with any corresponding validation messages.

In the examples below we'll take a simple form that requires a name, email and an age. We'll add the front-end validation, capture any back-end validation errors, and show a success message when everything has been submitted.

```jsx
import { Form, Field } from 'formv';

export default function MyForm() {
    return (
        <Form onSubmitted={handleSubmitted}>
            <Field>
                <input type="text" name="name" required />
            </Field>

            <Field>
                <input type="email" name="email" required />
            </Field>

            <Field>
                <input name="age" required min={18} />
            </Field>

            <button type="submit">Submit</button>
        </Form>
    );
}
```

Voila! Using the above code you have everything you need to validate your form. By clicking the `button` all validation rules will be checked, and if you've not filled in the required fields then you'll see a message appear next to the relevant `input` fields.

## Customising Messages

It's good and well relying on the native validation, but if you were to look in different browsers, each validation message would read slightly differently &ndash; which is awful for applications that strive for consistency! In those cases the `Field` component accepts a `messages` which is a map of [the `ValidityState` object](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState). By using the `messages` prop we can provide consistent messages across all browsers.

```jsx
import { Form, Field } from 'formv';

export default function MyForm() {
    return (
        <Form onSubmitted={handleSubmitted}>
            <Field messages={{ valueMissing: 'Please enter your first and last name.' }}>
                <input type="text" name="name" required />
            </Field>

            <Field
                messages={{
                    valueMissing: 'Please enter your email address.',
                    typeMismatch: 'Please enter a valid email address.',
                }}
            >
                <input type="email" name="emailAddress" required />
            </Field>

            <Field
                messages={{
                    valueMissing: 'Please enter your age.',
                    rangeUnderflow: 'You must be 18 or over to use this form.',
                }}
            >
                <input name="age" required min={18} />
            </Field>

            <button type="submit">Submit</button>
        </Form>
    );
}
```

Now when you submit the form in Chrome, Firefox, Edge, Safari, Opera, etc... you will note that all of the messages appear the same &ndash; you're no longer allowing the browser to control the content of the validation messages.

## Skipping Validation

There are _some_ instances where skipping validation might be beneficial. Although you can't skip the back-end validation from `Formv` directly &mdash; you should configure your back-end to accept an optional param that skips validation &mdash; it's quite easy to skip the front-end validation by introducing another `button` element with the native [`formnovalidate` attribute](https://www.w3schools.com/jsref/prop_form_novalidate.asp).

In the above form if you were to add another button alongside our existing `button`, you can have one `button` that runs the front-end validation in its entirety, and another `button` that skips it altogether.

```jsx
<button type="submit">Submit</button>
<button type="submit" formNoValidate>Submit Without Validation</button>
```

Interestingly when you tap `enter` in a form, the first `button` in the DOM hierarchy will be the button that's used to submit the form; in the above case `enter` would run the validation. However if you were to reverse the order of the buttons in the DOM, the `enter` key will submit the form **without** the front-end validation.

## JS Validation

For the most part the native HTML validation is sufficient for our forms, especially when you consider the power that the [`pattern` attribute](https://www.w3schools.com/tags/att_input_pattern.asp) provides with regular expression based validation. Nevertheless there will **always** be edge-cases where HTML validation doesn't quite cut the mustard. In those cases `Formv` provides the `Error.Validation` and `Error.Generic` exceptions that you can raise during the `onSubmitting` phase.

```jsx
import { Form, Error } from 'formv';
import * as utils from './utils';

const handleSubmitting = () => {

    if (!utils.passesQuirkyValidation(state)) {
        throw new Error.Validation({
            name: 'Does not pass our quirky validation rules.'
        });
    }

});

<Form onSubmitting={handleSubmitting} />
```

It's worth noting that any errors that are thrown from the `onSubmitting` handler will be merged with the native HTML validation messages.

## API Validation

It's all good and well having the front-end validation for your forms, however there are always cases where the front-end validation passes just fine, whereas the back-end throws a validation error &ndash; maybe the username is already taken, for instance. In those cases we need to feed the API validation messages back into the `Form` component by using the `Error.Validation` exception that Formv exports.

The validation messages need to be flattened and should map to your field names &ndash; for cases where you have an array of fields, we recommend you name these `names.0.firstName`, `names.1.firstName`, etc...

Continuing from the above example, we'll implement the `handleSubmitted` function which handles the submitting of the data to the API.

```jsx
import { Form, Error } from 'formv';

async function handleSubmitted() {
    try {
        await api.post('/send', data);
    } catch (error) {
        const isBadRequest = error.response.status === 400;
        if (isBadRequest) throw new Error.Validation(error.response.data);
        throw error;
    }
}

<Form onSubmitted={handleSubmitted} />;
```

In the example above we're capturing all API errors &ndash; we then check if the status code is a `400` which indicates a validation error in our application, and then feeds the validation errors back into `Formv`. The param passed to the `Error.Validation` should be a map of errors that correspond to the `name` attributes in your fields &ndash; we will then show the messages next to the relevant fields &ndash; for instance the `error.response.data` may be the following from the back-end if we were to hard-code it on the front-end.

```javascript
throw new Error.Validation({
    name: 'Please enter your first and last name.',
    age: 'You must be 18 or over to use this form.',
});
```

However there may be another error code that indicates a more generic error, such as that we weren't able to validate the user at this present moment &ndash; perhaps there's an error in our back-end code somewhere. In those cases you can instead raise a `Error.Generic` to provide helpful feedback to the user.

```jsx
import { Form, Error } from 'formv';

async function handleSubmitted() {
    try {
        await api.post('/send', data);
    } catch (error) {
        const isAxiosError = error.isAxiosError;
        const isBadRequest = error.response.status === 400;

        if (isBadRequest) throw new Error.Validation(error.response.data);
        if (isAxiosError) throw new Error.Generic(error.response.data);
        throw error;
    }
}

<Form onSubmitted={handleSubmitted} />;
```

Using the above example we throw `Error.Validation` errors when the request yields a `400` error message, we raise a `Error.Generic` error when the error is Axios specific. Any other errors are re-thrown for capturing elsewhere, as they're likely to indicate non-request specific errors such as syntax errors and non-defined variables.

## Success Messages

With all the talk of validation errors and generic errors, it may have slipped your mind that sometimes forms submit successfully! In those rare cases we provide success messages which sit in the exact same location as generic error messages, which makes them super simple to setup in a CSS grid.

In your `onSubmitted` callback all you need to do is yield a `Success` class with the content set to some kind of success message.

```jsx
import { Form, Success, Error } from 'formv';

async function handleSubmitted() {
    try {
        await api.post('/send', data);
        return new Success('Everything went swimmingly!');
    } catch (error) {
        const isAxiosError = error.isAxiosError;
        const isBadRequest = error.response.status === 400;

        if (isBadRequest) throw new Error.Validation(error.response.data);
        if (isAxiosError) throw new Error.Generic(error.response.data);
        throw error;
    }
}

<Form onSubmitted={handleSubmitted} />;
```

## Applying Styles

Although Formv uses the [`display: contents`](https://caniuse.com/#feat=css-display-contents) on the `form`, `fieldset` and `Field` container to make styling easier, support is still lacking in pre-Chromium versions of Edge. Therefore to support those browsers you'll need to _normalise_ the `form`, `fieldset` and `Field` container elements by passing the `legacy` prop to the `Form` component.

You can then style consistently across all browsers regardless of `contents` support.

By default Formv applies the `Messages` component after your `children` in the `Field` component &ndash; for cases where styling is easier if the `Messages` appears before, you can use the `position` prop on `Field` &ndash; it accepts two possible options: `before` and `after` (default).

```jsx
<Field position="before">
    <input type="text" name="firstName" required />
</Field>
```

One of the great things about the `display: contents` is that by default **all** of the `Formv` elements are styled that way, and as such you can take full advantage of CSS grids to style your forms. With the elements in the `Field` component being the first set of elements that will be styled according to your grid layout.

## Renderer

By default `Formv` uses its own renderer for displaying error messages, and provides appropriate class names for you to style. Nevertheless it may be easier to style if you provide your own `renderer` prop to the `Form` component, which allows you take full control over the messages. It's especially useful if you use styling techniques such as `styled-components`.

Taking advantage of your own custom `renderer` requires setting up a component that accepts three props: `message`, `messages` and `type` where `type` can be one of the three values: `success`, `error-generic` and `error-validation`. The `messages` prop is populated for error messages, and the `message` prop is populated for success messages.

```jsx
<Form renderer={props => <Messages {...props} />} onSubmitted={handleSubmitted} />
```

We provide an [example of the custom `Messages` renderer](/Wildhoney/Formv/blob/master/example/js/components/Messages/index.js) in the `example/` directory.

## Default Behaviours

By default Formv disables the form when it's being submitted, which includes the buttons you attach to your form which can be styled with the `:disabled` pseudo-class &ndash; you can disable this by adding `noDisable` to the `Form`. Likewise with the scrolling to the highest invalid element &ndash; that functionality can be disabled by adding `noScroll` to `Form`.

You can also skip the front-end validation entirely on a button-by-button basis with the native `formNoValidate` attribute on your chosen button.

> Note that if you need anything from state, Formv exports the `Context` which you can use in the `useContext` hook or via the more traditional `Context.Consumer` approach.
