'use strict';

var ValidatorFactory = require('@ryanburnette/validator-factory');
var isEqual = require('lodash.isequal');
var email = require('./email');

module.exports = function ({body, constraints, validate, notifications, mailgun}) {
  var success = true;
  var jobs = [];

  if (!constraints && !validate) {
    throw new Error('options.constraints or options.validate required');
  }

  if (constraints && !validate) {
    validate = ValidatorFactory.create({constraints});
  }

  var {validation, body: vbody} = validate(body);
  if (validation) {
    success = false;
  }

  if (!isEqual(body, vbody)) {
    success = false;
  }

  if (success && notifications) {
    email({notifications, body: vbody, mailgun});
  }
  
  return Promise.all(jobs)
    .then(function () {
      return {success, validation, body: vbody};
    });
};
