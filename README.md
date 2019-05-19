# @ryanburnette/[contact-form-endpoint][1]

## Usage

```js
var ContactFormEndpoint = require('@ryanburnette/contact-form-endpoint');

var endpoint = ContactFormEndpoint.create({
  constraints: {
    name: {
      presence: {
        allowEmpty: false
      }
    },
    email: {
      presence: {
        allowEmpty: false
      },
      email: true
    }
  },
  notifications: [
    {
      from: 'Form API <no-reply@example.com>',
      to: '{sender}', // `${name} <${email}>`
      html: '{auto}', // the auto template renders all fields
      text: '{auto}' // the auto template strips html for a text email fallback
    }
  ],
  mailgun: {
    apiKey: '',
    domain: ''
  }
});

app.use('/api/forms/contact', endpoint);
```

Endpoints can easily be generated by passing in a object that came from parsed
YAML or a database.

## Notifications

Notifications are sent using Mailgun.

Define notifications using the notification attribute of options... an array of
objects.

## Required Fields

For notificatons, the `name` field must be present either as `name` or
`first_name` and `last_name`.

For notificatons, the `email` field must be present.

## Validation

The validation is provided by [@ryanburnette/validator-factory][2] which is a
slightly modified implementation of [Validate.js][3].

If unexpected data is submitted, the submission will not succeed, even if it
has no validation.

## Replacements

- `{sender}` will be replaced with the info for who submitted the form... ie.
  `John Q. Public <jqp@gmail.com>`

[1]: https://code.ryanburnette.com/ryanburnette/contact-form-endpoint
[2]: https://code.ryanburnette.com/ryanburnette/validator-factory
[3]: https://validatejs.org/