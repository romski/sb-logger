'use strict';

const winston = require('winston'),
  _ = require('lodash'),
  moment = require('moment'),
  util = require('util');

process.setMaxListeners(100);

function getLogger(config) {
  let defaultTransports = [
      new winston.transports.Console({
        json: true,
        handleExceptions: true,
        humanReadableUnhandledException: true
      })
    ],
    logger = new winston.Logger({
      transports: config.transports || defaultTransports,
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

  function log(level, config) {
    return function () { // actual log method
      let message = util.format.apply(undefined, arguments),
        msg = {
          name: config.name,
          timestamp: moment().utc().toISOString(),
          context: config.ctxt,
          message: message ? message.replace(/\n/g, '') : ''
        };

      _.each(config.masks, function (mask) {
        msg.message = msg.message.replace(mask.pattern, mask.mask);
      });

      logger.log(level, msg);
    };
  }

  function setLogLevel(level, transport) {
    if (transport) {
      logger.transports[transport].level = level;
    } else {
      logger.transports.console.level = level;
    }
  }

  return {
    debug: log('debug', config),
    info: log('info', config),
    warn: log('warn', config),
    error: log('error', config),
    setLogLevel: setLogLevel
  };
}

module.exports.getLogger = getLogger;