'use strict';

var moment = require('moment');

function format(args){
  let data = [];

  args.meta = args.meta || {};
  args.meta.context = args.meta.context || {};
  args.meta.message = args.meta.message || '-';

  data.push('SB_REST_1');
  data.push(args.level || '-');
  data.push(args.meta.timestamp || moment().utc().toISOString());
  data.push(args.meta.context.CORRELATION_ID || '-');
  data.push(args.meta.context.SESSION_ID || '-');
  data.push(args.meta.context.USER_ID || '-');
  data.push(args.meta.context.ACCOUNT_ID || '-');
  data.push(args.meta.context.URL || '-');
  data.push(args.meta.context.METHOD || '-');
  data.push(args.meta.name && args.meta.name.replace(/ /g, '-') || '-');
  data.push(args.meta.message.replace(/\n/g, ''));

  return data.join(' ');
}

module.exports = format;