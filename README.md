<img src="example/images/logo.png" alt="Formv" width="150px" />

> React form validation using the validation native to all recent browsers. Also includes support for handling API validation messages, success messages, memoized and nested form state, and super easy styling.

![Travis](http://img.shields.io/travis/Wildhoney/Formv.svg?style=for-the-badge)
&nbsp;
![npm](http://img.shields.io/npm/v/formv.svg?style=for-the-badge)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-lightgrey.svg?style=for-the-badge)
&nbsp;
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

---

## Contents

1. [Getting Started](#getting-started)
2. [Customising Messages](#customising-messages)
3. [Skipping Validation](#skipping-validation)
4. [JS Validation](#js-validation)
5. [API Validation](#api-validation)
6. [Success Messages](#success-messages)
7. [Managing State](#managing-state)
8. [Custom Renderer](#custom-renderer)
9. [Default Behaviours](#default-behaviours)
10. [Form Architecture](#form-architecture)

## Getting Started

Formv utilises the native [form validation](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation) which is built-in to all recent browsers &ndash; as such, all validation rules are set on the relevant form fields using `required`, `pattern`, `minLength`, etc...

Formv has a philosophy that it should be easy to opt-out of form validation if and when you want to use another technique in the future. That means not coupling your validation to a particular method, which makes it easily reversible &ndash; that is why Formv comes with only two simple React components &ndash; `Form` and `Field`.

To get started you need to append the form to the DOM. Formv's `Form` component is a plain `form` element that intercepts the `onSubmit` function. We then nest all of our input fields in the `Form` component as you would normally. `Form` takes an optional function child as a function to pass the form's state &ndash; you can also use the context API for more complex forms.

In the examples below we'll take a simple form that requires a name, email and an age. We'll add the front-end validation, capture any back-end validation errors, and show a success message when everything has been submitted.

```jsx
import { Form, Messages } from 'formv';

export default function MyForm() {
    return (
        <Form onSubmitted={handleSubmitted}>
            {formState => (
                <>
                    <input type="text" name="name" required />
                    <Messages values={formState.feedback.name} />

                    <input type="email" name="email" required />
                    <Messages values={formState.feedback.email} />

                    <input name="age" required min={18} />
                    <Messages values={formState.feedback.age} />

                    <button type="submit">Submit</button>
                </>
            )}
        </Form>
    );
}
```

Voila! Using the above code you have everything you need to validate your form. By clicking the `button` all validation rules will be checked, and if you've not filled in the required fields then you'll see a message appear next to the relevant `input` fields.

## Customising Messages

It's good and well relying on the native validation, but if you were to look in different browsers, each validation message would read slightly differently &ndash; which is awful for applications that strive for consistency! In those cases the `Form` component accepts a `messages` which is a map of [the `ValidityState` object](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState). By using the `messages` prop we can provide consistent messages across all browsers.

```jsx
import { Form, Messages } from 'formv';

const messages = {
    name: { valueMissing: 'Please enter your first and last name.' },
    email: {
        valueMissing: 'Please enter your email address.',
        typeMismatch: 'Please enter a valid email address.',
    },
    age: {
        valueMissing: 'Please enter your age.',
        rangeUnderflow: 'You must be 18 or over to use this form.',
    },
};

export default function MyForm() {
    return (
        <Form messages={messages} onSubmitted={handleSubmitted}>
            {formState => (
                <>
                    <input type="text" name="name" required />
                    <Messages values={formState.feedback.name} />

                    <input type="email" name="email" required />
                    <Messages values={formState.feedback.email} />

                    <input name="age" required min={18} />
                    <Messages values={formState.feedback.age} />

                    <button type="submit">Submit</button>
                </>
            )}
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
        const isBadRequest = error.response.status === 400;
        const isAxiosError = error.isAxiosError;

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
        const isBadRequest = error.response.status === 400;
        const isAxiosError = error.isAxiosError;

        if (isBadRequest) throw new Error.Validation(error.response.data);
        if (isAxiosError) throw new Error.Generic(error.response.data);
        throw error;
    }
}

<Form onSubmitted={handleSubmitted} />;
```

## Managing State

Managing the state for your forms is not typically an arduous task, nevertheless there are techniques that can make everything just a little bit easier, which is why `Formv` exports a `useForm` hook that has the same interface as [`react-use`'s `useMap` hook](https://github.com/streamich/react-use/blob/master/docs/useMap.md) with a handful of differences &ndash; currying, memoization and nested properties.

```javascript
import { useForm } from 'formv';

const [state, { set }] = useForm({
    username: null,
    profile: {
        age: null,
        created: null,
    },
});
```

Using the `set` function provided by `useForm` you can use a curried function to pass to your `Input` component. Interestingly if you use the approach below rather than creating a new function every time, the `set('username')` will never change, and as such makes everything a whole lot easier when it comes to wrapping your `Input` field in [`memo`](https://reactjs.org/docs/react-api.html#reactmemo).

```jsx
<Input value={state.username} onChange={set('username')} />
<Input value={state.profile.age} onChange={set('profile.age')} />
<Input value={state.profile.created} onChange={set('profile.created')} />
```

In contrast, if you were to use the non-curried version &ndash; which works perfectly fine and is illustrated below &ndash; each time the component is rendered you'd be creating a new function which would cause the component to re-render even when it didn't need to. In an ideal scenario the component would only re-render when its value was modified.

```jsx
<Input value={state.username} onChange={({ target }) => set('username', target.value)} />
```

You'll also notice that nested objects are handled with the dot notation thanks to [`Lodash`](https://lodash.com/).

## Default Behaviours

By default Formv disables the form when it's being submitted, which includes the buttons you attach to your form which can be styled with the `:disabled` pseudo-class &ndash; you can disable this by adding `noDisable` to the `Form`. Likewise with the scrolling to the highest invalid element &ndash; that functionality can be disabled by adding `noScroll` to `Form`.

You can also skip the front-end validation entirely on a button-by-button basis with the native `formNoValidate` attribute on your chosen button.

> Note that if you need anything from state, Formv exports the `Context` which you can use in the `useContext` hook or via the more traditional `Context.Consumer` approach.

## Form Architecture

When deciding on an architecture for your forms, it's recommended to think about them as three separate layers. The first and most simple layer is the `Field` which handles logic pertaining to an individual input field; it can maintain its own state such as a country selector maintains its state for a list of countries, but it does **not** maintain state for its value. Secondly there is the `Fieldset` layer which composes many `Field` components and is again stateless. Last of all there is the parent `Form` component which maintains state for the entire form.

With the above architecture it allows your `Field` and `Fieldset` components to be used freely in any `Form` components without any quirky state management. The `Form` field has the ultimate responsibility of maintaining and submitting the data.

Using `Formv` it's easy to have the aforementioned setup as illustrated below.

```jsx
import * as fv from 'formv';

function Form() {
    const [state, { set }] = fv.useForm({
        name: null,
        age: null,
    });

    return (
        <fv.Form onSubmitted={handleSubmitted}>
            <Fieldset onChange={set} />
        </fv.Form>
    );
}
```

```jsx
function Fieldset({ onChange }) {
    return (
        <>
            <FieldName onChange={onChange('name')} />
            <FieldAge onChange={onChange('age')} />
        </>
    );
}
```

```jsx
import * as fv from 'formv';
import { useContext } from 'react';

function FieldName({ onChange }) {
    const formState = useContext(fv.Context);

    return (
        <>
            <input name="name" type="text" onChange={({ target }) => onChange(target.value)} />
            <fv.Messages values={formState.feedback.field.name} />
        </>
    );
}
```

```jsx
import * as fv from 'formv';
import { useContext } from 'react';

function FieldAge({ onChange }) {
    const formState = useContext(fv.Context);

    return (
        <>
            <input name="age" type="number" onChange={({ target }) => onChange(target.value)} />
            <fv.Messages values={formState.feedback.field.age} />
        </>
    );
}
```
