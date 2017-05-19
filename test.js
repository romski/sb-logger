log = require('./logger').getLogger({ format: 'sb_web_1', maxChars: 5 }, 'log1');
log.info('Logging! Logging! Logging! Logging!');

log = require('./logger').getLogger({ format: 'sb_web_1' }, 'log2');
log.info('Logging! Logging! Logging! Logging!');

jwt = "aA9-_.aA9-_.aA9-_";

log = require('./logger').getLogger({ format: 'sb_web_1' }, 'log3');
log.info('Logging! ' + jwt + ' foo bar');

log = require('./logger').getLogger({ format: 'sb_web_1', masks: [ { pattern: /foo/, mask: 'bar' } ] }, 'log4');
log.info('Logging! ' + jwt + ' foo bar');