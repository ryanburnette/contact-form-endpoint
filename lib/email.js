'use strict';

var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var striptags = require('striptags');
var { pick } = require('lodash');

var auto = fs.readFileSync(
  path.resolve(__dirname, '../templates/auto.html'),
  'utf8'
);

module.exports = function ({ mailgun, options, body, hooks }) {
  if (!options.html) {
    options.html = auto;
  }

  Object.keys(options).forEach(function (k) {
    options[k] = ejs.render(options[k], { body });
  });

  if (!options.text) {
    options.text = striptags(options.html);
  }

  return mailgun
    .messages()
    .send(options)
    .then(function (result) {
      if (hooks && hooks.emailSuccess) {
        hooks.emailSuccess(result);
      }
    })
    .catch(function (err) {
      console.error(err);
      if (hooks && hooks.emailFail) {
        hooks.emailFail(err);
      }
    });
};
