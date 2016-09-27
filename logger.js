'use strict';

const winston = require('winston'),
  _ = require('lodash'),
  moment = require('moment'),
  util = require('util'),
  jwtMask = {pattern: /(Bearer [a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?)/gm, mask: '****'},
  masks = [
    jwtMask
  ],
  formatters = {
    'sb_rest_1': require('./format/sb_rest_1'),
    'sb_rest_2': require('./format/sb_rest_2')
  },
  defaultFormatter = formatters['sb_rest_1'],
  defaultTransports = [];

/**
 * Factory for loggers
 * @param config - formatter id, or config object
 * @param name - optional name of the logger
 * @returns {{debug: *, info: *, warn: *, error: *, setLogLevel: setLogLevel}}
 */
function getLogger(config, name) {
  let logger;

  config = config || {};

  logger = new winston.Logger({
    transports: config.transports || getDefaultTransports(config.format || config),
    levels: {
      debug: 4,
      info: 3,
      warn: 2,
      error: 1
    },
    level: 'info'
  });

  function log(level, config) {
    return function () { // actual log method
      let message = util.format.apply(undefined, arguments),
        msg = {
          name: config.name || name,
          timestamp: moment().utc().toISOString(),
          context: config.ctxt,
          message: message ? message.replace(/\n/g, '') : ''
        };

      _.each(config.masks || masks, function (mask) {
        msg.message = msg.message.replace(mask.pattern, mask.mask);
      });

      logger.log(level, msg);
    };
  }

  function setLogLevel(level, transport) {
    logger.transports[transport || 'console'].level = level;
  }

  return {
    debug: log('debug', config),
    info: log('info', config),
    warn: log('warn', config),
    error: log('error', config),
    setLogLevel: setLogLevel
  };
}

function getDefaultTransports(format) {
  defaultTransports[0] = new winston.transports.Console({formatter: getFormatter(format)});
  return defaultTransports;
}

function getFormatter(format) {
  return formatters[format] || defaultFormatter;
}

module.exports = {
  getLogger: getLogger,
  getFormatter: getFormatter
};