'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var ValidatorFactory = require('@ryanburnette/validator-factory');
var submit = require('./submit');

module.exports = function ({constraints, notifications, mailgun}) {
  var validate = ValidatorFactory.create({constraints});

  var endpoint = express.Router();
  
  endpoint.post('/', bodyParser.json(), function (req, res) {
    var body = req.body;
    submit({constraints, notifications, body, mailgun})
      .then(function (result) {
        res.json(result);
      });
  });

  return {endpoint};
};
