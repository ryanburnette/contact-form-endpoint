'use strict';

module.exports = function ({options, mailgun}) {
  return require('./mailgun')(mailgun).messages().send(options);
};
