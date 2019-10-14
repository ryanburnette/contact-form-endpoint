# [contact-form-endpoint][1]

[![repo](https://img.shields.io/badge/repository-Github-black.svg?style=flat-square)](https://github.com/ryanburnette/contact-form-endpoint)
[![npm](https://img.shields.io/badge/package-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/contact-form-endpoint)

A contact form API endpoint with honeypot, validation, and email delivery.

## Usage

```js
var express = require('express');
var contactFormEndpoint = require('@ryanburnette/contact-form-endpoint');

var app = express();

var contact = contactFormEndpoint.create({
  // opts
});

app.use('/api/forms/contact', contact);
```

See `demo.js` for full usage.

## Honeypot

Any post body attributes not found in the contraints will trigger the honeypot.
A honeypot request is given a 200 response while no further action is taken. Put
at least one hidden field in your form that is not present in your contraints to
take advantage of the honeypot's proection.

## Validation

The constraints of the form are passed directly to [Validate.js][3]. If the
validation object is not undefined it is returned as JSON with a 422 status
code.

## Emails

Emails are rendered using [ejs][5] then sent using [mailgun-js][4].

Use `opts.email` if there's just one notification. If there are multiple,
provide an array of email configuration objects at `opts.emails`.

If no template is provided, HTML and text templates are automatically generated.
If an HTML template is provided it will be used and the text template will be
generated from it by stripping its HTML tags. If both are provided, they will
both be used.

```js
var endpoint = contactFormEndpoint.create({
  // ...
  emails: [
    {
      from: 'Team <no-reply@mysite.com>',
      to: '<%= data.name %> <<%= data.email %>>', // note that you can use EJS in any field
      'h:Reply-To': '<%= data.name %> <<%= data.email %>>',
      subject: 'Thank you for your submission',
      html: '', // EJS HTML template
      text: '' // EJS text template
    }
  ]
});
```

## Mailgun

The [mailgun-js][4] lib expects requires credentials.

```js
var endpoint = contactFormEndpoint.create({
  // ...
  mailgun: {
    apiKey: '',
    domain: ''
  }
});
```

## Hooks

Provide hooks for additional steps like writing to a database or making an
additional HTTP request.

```js
var endpoint = contactFormEndpoint.create({
  // ...
  hooks: {
    honeypot: function(req) {
      console.log(req.body, 'triggered the honeypot');
    },
    validation: function(req, validation) {
      console.log(req.body, validation, 'was invalid');
    },
    success: function(req) {
      console.log(req.body, 'success');
    },
    emailSuccess: function(result) {
      console.log(result);
    },
    emailFail: function(err) {
      console.error(err);
    }
  }
});
```

[1]: https://github.com/ryanburnette/contact-form-endpoint#readme
[3]: https://github.com/ansman/validate.js
[4]: https://www.npmjs.com/package/mailgun-js
[5]: https://ejs.co
