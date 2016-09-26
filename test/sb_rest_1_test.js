// format is space delimited fields
// each field has a '-' character if no other data is available
// only the message may contain spaces
// the message is everything after the name field
// fields:
//  code level timestamp corr-id sess-id user-id acct-id url method name message
var _ = require('lodash');

describe('sb_rest_1 format', function () {
  var output,
    args,
    format = require('../format/sb_rest_1.js'),
    timestamp = /[0-9]{4}-[0-9]{2}-[0-9]{1,2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/;

  function validate() {
    var formatted = format(args).split(' '),
      message = _.slice(formatted, 10, formatted.length).join(' '),
      fields = _.slice(formatted, 0, 10);

    fields[10] = message;

    _.each(output, function (expected, i) {
      if (expected !== 'timestamp') {
        expect(fields[i]).toEqual(expected);
      } else {
        expect(!!fields[i].match(timestamp)).toBe(true);
      }
    })
  }

  beforeEach(function () {
    output = ['SB_REST_1', 'info', 'timestamp', 'corr-id', 'sess-id', 'user-id', 'acct-id', 'url', 'method', 'my-name', 'foo bar baz'];
    args = {
      level: 'info',
      meta: {
        context: {
          CORRELATION_ID: 'corr-id',
          SESSION_ID: 'sess-id',
          USER_ID: 'user-id',
          ACCOUNT_ID: 'acct-id',
          URL: 'url',
          METHOD: 'method'
        },
        name: 'my-name',
        message: 'foo bar baz'
      }
    };
  });

  it('should log all', function () {
    validate();
  });

  it('should log - when level missing', function () {
    delete args.level;
    output[1] = '-';
    validate();
  });

  it('should log - when corr-id missing', function () {
    delete args.meta.context.CORRELATION_ID;
    output[3] = '-';
    validate();
  });

  it('should log - when sess-id missing', function () {
    delete args.meta.context.SESSION_ID;
    output[4] = '-';
    validate();
  });

  it('should log - when user-id missing', function () {
    delete args.meta.context.USER_ID;
    output[5] = '-';
    validate();
  });

  it('should log - when acct-id missing', function () {
    delete args.meta.context.ACCOUNT_ID;
    output[6] = '-';
    validate();
  });

  it('should log - when url missing', function () {
    delete args.meta.context.URL;
    output[7] = '-';
    validate();
  });

  it('should log - when method missing', function () {
    delete args.meta.context.METHOD;
    output[8] = '-';
    validate();
  });

  it('should log - when name missing', function () {
    delete args.meta.name;
    output[9] = '-';
    validate();
  });

  it('should log - when message missing', function () {
    delete args.meta.message;
    output[10] = '-';
    validate();
  });

  it('should fail safe when meta missing', function () {
    delete args.meta;
    output = ['SB_REST_1', 'info', 'timestamp', '-', '-', '-', '-', '-', '-', '-', '-'];
    validate();
  });

  it('should fail safe when context missing', function () {
    delete args.meta.context;
    output = ['SB_REST_1', 'info', 'timestamp', '-', '-', '-', '-', '-', '-', 'my-name', 'foo bar baz'];
    validate();
  });

  it('should fail safe when message missing', function () {
    delete args.meta.message;
    output[10] = '-';
    validate();
  });

  it('should remove new lines from message', function () {
    args.meta.message = 'foo \nbar \nbaz';
    validate();
  });
});