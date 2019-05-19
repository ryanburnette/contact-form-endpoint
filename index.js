'use strict';

var ContactFormEndpoint = {};

ContactFormEndpoint.email = require('./lib/email');
ContactFormEndpoint.submit = require('./lib/submit');
ContactFormEndpoint.create = require('./lib/create');

module.exports = ContactFormEndpoint;
