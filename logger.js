'use strict';

const winston = require('winston'),
  _ = require('lodash'),
  moment = require('moment'),
  util = require('util'),
  jwtMask = { pattern: /([a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?)/gm, mask: '****' },
  formatters = {
    'sb_rest_1': require('./format/sb_rest_1'),
    'sb_rest_2': require('./format/sb_rest_2'),
    'sb_web_1': require('./format/sb_web_1')
  },
  defaultFormatter = formatters['sb_rest_1'],
  defaultTransports = [];

let masks = [ jwtMask ];

/**
 * Factory for loggers
 * @param config - formatter id, or config object
 * @param name - optional name of the logger
 * @returns {{debug: *, info: *, warn: *, error: *, setLogLevel: setLogLevel}}
 */
function getLogger(config, name) {
  config = config || {};
  masks = masks.concat(config.masks || []);

  const chunkPattern = new RegExp('.{1,' + (config.splitChars || 1000) + '}', 'g');

  const logger = new winston.Logger({
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
      const parts = split(util.format.apply(undefined, arguments));
      const entry = {
        name: config.name || name,
        timestamp: moment().utc().toISOString(),
        context: config.ctxt
      };

      let count = 1;

      _.each(parts, (part) => {
        entry.message = `[${count++}/${parts.length}] ${mask(part)}`;
        logger.log(level, entry);
      });
    };
  }

  function setLogLevel(level, transport) {
    logger.transports[transport || 'console'].level = level;
  }

  function split(message) {
    const chunks = [];
    _.each(_.words(message, chunkPattern), chunk => {
      chunks.push(chunk);
    });
    return chunks;
  }

  function mask(text) {
    _.each(masks, (mask) => {
      text = text.replace(mask.pattern, mask.mask);
    });
    return text;
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
  defaultTransports[0] = new winston.transports.Console({ formatter: getFormatter(format) });
  return defaultTransports;
}

function getFormatter(format) {
  return formatters[format] || defaultFormatter;
}

module.exports = {
  getLogger: getLogger,
  getFormatter: getFormatter
};