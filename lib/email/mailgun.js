'use strict';

var Mailgun = require('mailgun-js');

var required = ['apiKey','domain'];

module.exports = function (options) {
  required.forEach(function (o) {
    if (!options[o]) {
      throw new Error(`options.${o} is required`);
    }
  });

  return Mailgun(options);
};
