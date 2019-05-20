# @ryanburnette/[contact-form-endpoint][1]

[![npm version](https://badge.fury.io/js/%40ryanburnette%2Fcontact-form-endpoint.svg)](https://badge.fury.io/js/%40ryanburnette%2Fcontact-form-endpoint)

## Usage

```js
var yaml = require('js-yaml');
var ContactFormEndpoint = require('@ryanburnette/contact-form-endpoint');

var {constraints,notifications} = yaml.safeLoad(fs.readFileSync('./data/forms/contact.yml', 'utf8'));

var notifications.html = {
  template: fs.readFileSync('./data/forms/contact-template.html.ejs', 'utf8'),
  bodyFilter: function (body) {
    return new Promise(function (resolve) {
      body.custom = 'foo';
      resolve(body);
    })
  }
};

var mailgun = {
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
};

var endpoint = ContactFormEndpoint.create({constraints, notifications, mailgun});

app.use('/api/forms/contact', endpoint);
```

Endpoints can easily be generated by passing in a object that came from parsed
YAML or a database.

```yaml
---
# ./data/forms/contact.yml
constraints:
  name:
    presence:
      allowEmpty: false
  email:
    email: true
    presence:
      allowEmpty: false
notifications:
  from: Form API <no-reply@example.com>
  to: John Doe <admin@example.com>
  reply-to: sender
  html: auto
  text: auto
```

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

- `auto` Renders an automatic HTML templates or strips tags from HTML rendered
  template for TEXT version
- `sender` will be replaced with the info for who submitted the form... ie.
  `John Doe <admin@example.com>`

[1]: https://code.ryanburnette.com/ryanburnette/contact-form-endpoint
[2]: https://code.ryanburnette.com/ryanburnette/validator-factory
[3]: https://validatejs.org/
