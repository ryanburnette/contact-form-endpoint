'use strict';

var ejs = require('ejs');
var hat = require('hat');
var emailify = require('./emailify');
var fs = require('fs');
var path = require('path');
var striptags = require('striptags');
var isObject = require('lodash.isobject');

var required = ['from','to','subject','html','text'];

module.exports = function ({notification, body}) {
  var options = {};
  var queue = [];

  required.forEach(function (o) {
    if (!notification[o] || String(notification[0]).length == 0) {
      throw new Error(`notification.${o} is required`);
    }
  });

  var name = body.name || [body.first_name, body.last_name].join(' ');
  var email = body.email;

  options.from = notification.from;

  if (options.from == 'sender') {
    options.from = emailify(body.name,body.email);
  }
  else {
    options.from = notification.from;
  }

  options.to = notification.to;

  if (options.to == 'sender') {
    options.to = emailify(body.name,body.email);
  }

  if (notification['reply-to']) {
    options['h:Reply-To'] = notification['reply-to'];
  }

  if (options['h:Reply-To'] == 'sender') {
    options['h:Reply-To'] = emailify(body.name,body.email);
  }

  // unique subject for better email threading
  options.subject = [notification.subject,hat(32)].join(' ');

  if (isObject(notification.html)) {
    queue.push(
      Promise.resolve(notification.html.bodyFilter(body))
        .then(function (mbody) {
          options.html = ejs.render(notification.html.template, {body: mbody});
        })
    );
  }
  else
  if (notification.html == 'auto') {
    // render default html template
    var filepath = path.resolve(__dirname,'templates/auto.html.ejs');
    var template = fs.readFileSync(filepath, 'utf8');
    options.html = ejs.render(template,{body});
  }
  else {
    options.html = ejs.render(notification.html,{body});
  }

  if (isObject(notification.text)) {
    queue.push(
      Promise.resolve(notification.text.bodyFilter(body))
        .then(function (mmbody) {
          ejs.render(notification.text.template, {body: mmbody});
        })
    );
  }
  else
  if (notification.text == 'auto') {
    options.text = striptags(options.html);
  }
  else {
    options.text = ejs.render(notification.text,{body});
  }

  return Promise.all(queue)
    .then(function () {
      return options;
    });
};
