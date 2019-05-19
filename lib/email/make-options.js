'use strict';

var ejs = require('ejs');
var hat = require('hat');
var emailify = require('./emailify');
var fs = require('fs');
var path = require('path');
var striptags = require('striptags');

var required = ['from','to','subject','html','text'];

module.exports = function ({notification, body}) {
  var options = {};

  var name = body.name || [body.first_name, body.last_name].join(' ');
  var email = body.email;

  options.from = notification.from;

  if (options.from == '{sender}') {
    options.from = emailify(body.name,body.email);
  }
  else {
    options.from = notification.from;
  }

  options.to = notification.to;

  if (options.to == '{sender}') {
    options.to = emailify(body.name,body.email);
  }

  if (notification['reply-to']) {
    options['h:Reply-To'] = notification['reply-to'];
  }

  if (options['h:Reply-To'] == '{sender}') {
    options['h:Reply-To'] = emailify(body.name,body.email);
  }

  // unique subject for better email threading
  options.subject = [notification.subject,hat(32)].join(' ');

  if (notification.html == '{auto}') {
    // render default html template
    var filepath = path.resolve(__dirname,'templates/auto.html.ejs');
    var template = fs.readFileSync(filepath, 'utf8');
    options.html = ejs.render(template,{body});
  }
  else {
    options.html = ejs.render(notification.html,{body});
  }

  var templateText = notification.text;

  if (templateText == '{auto}') {
    options.text = striptags(options.html);
  }
  else {
    options.text = ejs.render(notification.text,{body});
  }

  required.forEach(function (o) {
    if (!options[o] || String(options[0]).length == 0) {
      throw new Error(`options.${o} is required`);
    }
  });

  return options;
};
