'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var validate = require('validate.js');
var honeypot = require('./honeypot');
var email = require('./email');
var { merge } = require('lodash');

module.exports = function(opts) {
  var app = express.Router();

  if (opts.mailgun && opts.mailgun.apiKey && opts.mailgun.domain) {
    var mailgun = require('./mailgun')({
      apiKey: opts.mailgun.apiKey,
      domain: opts.mailgun.domain
    });
  }

  app.use(bodyParser.json());

  app.post('/', function(req, res) {
    if (honeypot(opts.constraints, req.body)) {
      if (opts.hooks.honeypot) {
        opts.hooks.honeypot(req);
      }
      res.sendStatus(200);
      return;
    }

    var validation = validate(req.body, opts.constraints);
    if (validation) {
      if (opts.hooks.validation) {
        opts.hooks.validation(req, validation);
      }
      res.status(422).json(validation);
      return;
    }

    if (opts.email) {
      email({
        mailgun,
        options: opts.email,
        body: req.body,
        hooks: opts.hooks
      });
    }
    if (opts.emails) {
      opts.emails.forEach(function(eo) {
        email({
          mailgun,
          options: eo,
          body: req.body,
          hooks: opts.hooks
        });
      });
    }

    if (opts.hooks.success) {
      opts.hooks.success(req);
    }

    res.sendStatus(200);
    return;
  });

  return app;
};
