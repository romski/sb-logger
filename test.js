log = require('./logger').getLogger({ format: 'sb_web_1', maxChars: 5 }, 'foo');
log.info('Logging! Logging! Logging! Logging!');

log = require('./logger').getLogger({ format: 'sb_web_1' }, 'bar');
log.info('Logging! Logging! Logging! Logging!');