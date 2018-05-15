'use strict';

//Parse command line options
const cliopts = (argv) => {
  return require('yargs')
    .usage('Usage: $0 [options]')
    .options({
      'stack-name': {
        type: 'string', 
        demandOption: true
      },
      'template-body': {
        type: 'string'
      },
      'stack-policy-body': {
        type: 'string'
      },
      'accesskeyid': {
        type: 'string'
      },
      'secretkey': {
        type: 'string'
      },
      'parameters': {
        type: 'array'
      },
      'tags': {
        type: 'array'
      },
      'region': {
        type: 'string',
        default: 'eu-west-1'
      },
      'profile': {
        type: 'string'
      },
      'role-arn': {
        type: 'string'
      },
      'resource-types': {
        type: 'array'
      },
      'template-url': {
        type: 'string'
      },
      'stack-policy-url': {
        type: 'string'
      },
      'stack-policy-during-update-body': {
        type: 'string'
      },
      'stack-policy-during-update-url': {
        type: 'string'
      },
      'notification-arns': {
        type: 'array'
      },
      'timeout-in-minutes': {
        type: 'number'
      },
      'disable-rollback': {
        type: 'boolean', 
        default: undefined
      },
      'use-previous-template': {
        type: 'boolean', 
        default: undefined
      },
      'enable-termination-protection': {
        type: 'boolean',
        default: undefined
      },
      'stack-events': {
        type: 'boolean', 
        default: undefined
      },
      'capabilities': {
        type: 'array',
        choices: ['CAPABILITY_NAMED_IAM','CAPABILITY_IAM']
      },
      'on-failure': {
        type: 'string',
        choices: ['DO_NOTHING','ROLLBACK','DELETE'],
        default: undefined
      },
      'h': {
        alias: 'help'
      },
      'v': {
        alias: 'version'
      }
    })
    .implies('accesskeyid', 'secretkey')
    .implies('secretkey', 'accesskeyid')
    .conflicts('accesskeyid', 'profile')
    .conflicts('secretkey', 'profile')
    .conflicts('template-body', 'template-url')
    .conflicts('stack-policy-body', 'stack-policy-url')
    .showHelpOnFail(false, 'Something went wrong! run with --help or -h')
    .version()
    .fail((msg, err) => {
      /* istanbul ignore if */ 
      if (err) throw err; // preserve stack
      console.error(msg);
      /* istanbul ignore next */ 
      process.exit(1);
    })
    .parse(argv);
};

module.exports = {
  cliopts: cliopts
};

