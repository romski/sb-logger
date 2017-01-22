'use strict';

var moment = require('moment');

function format(args){
  let data = [];

  args.meta = args.meta || {};
  args.meta.context = args.meta.context || {};
  args.meta.message = args.meta.message || '-';

  data.push(args.meta.timestamp || moment().utc().toISOString());
  data.push(args.level || '-');
  data.push(args.meta.name || '');
  data.push(args.meta.message.replace(/\n/g, ''));

  return data.join(' ');
}

module.exports = format;