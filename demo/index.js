'use strict';

require('dotenv').config({});

var ContactFormEndpoint = require('../');

var {endpoint:contactForm} = ContactFormEndpoint.create({
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
    },
    message: {
    }
  },
  notifications: [
    {
      from: 'Form API <no-reply@example.com>',
      to: '{sender}', // `${name} <${email}>`
      'reply-to': 'Ryan Burnette <ryan.burnette@gmail.com>',
      subject: 'Contact Form Endpoint Demo',
      html: '{auto}', // the auto template renders all fields
      text: '{auto}' // the auto template strips html for a text email fallback
    }
  ],
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
});

var express = require('express');

var app = express();

app.use('/api/contact',contactForm);

app.listen(3000);
