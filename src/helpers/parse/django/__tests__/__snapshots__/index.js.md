# Snapshot report for `src/helpers/parse/django/__tests__/index.js`

The actual snapshot is saved in `index.js.snap`.

Generated by [AVA](https://avajs.dev).

## It should be able to flatten the array of Django validation messages;

> Snapshot 1

    {
      age: [
        'required',
      ],
      'location.city': [
        'required',
      ],
      'location.moved': [
        'required',
      ],
      'name.0.first': [
        'required',
      ],
      'name.0.last': [
        'required',
      ],
      'name.1.first': [
        'required',
      ],
    }

> Snapshot 2

    {
      'name.0.first': [
        'required',
      ],
      'name.0.last': [
        'required',
      ],
      'name.1.first': [
        'required',
      ],
    }

> Snapshot 3

    {
      'location.city': [
        'required',
      ],
      'location.moved': [
        'required',
      ],
    }