'use strict';

require('dotenv').config({});
var axios = require('axios');
var express = require('express');
var contactFormEndpoint = require('./');

var app = express();

var contact = contactFormEndpoint.create({
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  },
  constraints: {
    name: {
      presence: true
    },
    email: {
      presence: true,
      email: true
    },
    message: {}
  },
  email: {
    from: 'no-reply@email.u9edc.pw',
    to: '<%= body.name %> <<%= body.email %>>',
    'h:Reply-To': '<%= body.name %> <<%= body.email %>>',
    subject: 'Thank you for your submission'
  },
  hooks: {
    honeypot: function(req) {
      console.log('honeypot hook');
    },
    validation: function(req) {
      console.log('validation hook');
    },
    success: function(req) {
      console.log('success hook');
    },
    emailSuccess: function(result) {
      console.log('emailSuccess hook');
      process.exit();
    },
    emailFail: function(err) {
      console.log('emailFail hook');
      process.exit();
    }
  }
});

app.use('/api/contact', contact);

app.listen(3020, function() {
  axios
    .get('http://localhost:3020/api/contact/constraints')
    .then(function(resp) {
      console.log(resp.data);
    })
    .then(function() {
      return axios.post('http://localhost:3020/api/contact/submit', {
        name: 'Ryan Burnette',
        email: 'ryan.burnette@gmail.com',
        message: 'Hello'
      });
    })
    .then(function(resp) {
      console.log(resp.status, resp.data);
    })
    .catch(function(err) {
      console.error(err.response.status, err.response.data);
    });
});
