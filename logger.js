'use strict';

const winston = require('winston'),
  _ = require('lodash'),
  moment = require('moment'),
  util = require('util');

process.setMaxListeners(100);

function getLogger(config) {
  let logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        json: true,
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    ],
    exitOnError: false,
    levels: {
      debug: 4,
      info: 3,
      warn: 2,
      error: 1
    },
    level: 'warn'
  });

  if (!_.isObject(config)) {
    throw new Error('sb-logger config should be an object');
  }

  function log(type, config) {
    return function() { // actual log method
      let message = util.format.apply(undefined, arguments),
        msg = {
          name: config.name,
          timestamp: moment().utc().toISOString(),
          context: config.ctxt,
          message: message ? message.replace(/\n/g, '') : ''
        };
      logger.log(type, msg);
    };
  }

  return {
    debug: log('debug', config),
    info: log('info', config),
    warn: log('warn', config),
    error: log('error', config)
  };
}

module.exports.getLogger = getLogger;