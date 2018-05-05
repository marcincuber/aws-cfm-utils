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
        describe: 'CFM template file name',
        type: 'string'
      },
      'stack-policy-body': {
        describe: 'Stack policy file name',
        type: 'string'
      },
      'accesskeyid': {
        describe: 'AWS access key',
        type: 'string'
      },
      'secretkey': {
        describe: 'AWS secret key',
        type: 'string'
      },
      'h': {
        alias: 'help'
      },
      'parameters': {
        describe: 'CFM Parameters',
        type: 'array'
      },
      'tags': {
        describe: 'CFM Tags',
        type: 'array'
      },
      'region': {
        type: 'string',
        default: 'eu-west-1'
      },
      'capabilities': {
        type: 'array',
        choices: ['CAPABILITY_NAMED_IAM','CAPABILITY_IAM']
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
      'disable-rollback': {
        type: 'boolean', 
        default: undefined
      },
      'template-url': {
        type: 'string'
      },
      'stack-policy-url': {
        type: 'string'
      },
      'notification-arns': {
        type: 'array'
      },
      'timeout-in-minutes': {
        type: 'number'
      },
      'on-failure': {
        type: 'string',
        choices: ['DO_NOTHING','ROLLBACK','DELETE'],
        default: undefined
      },
      'use-previous-template': {
        type: 'boolean', 
        default: undefined
      },
      'stack-policy-during-update-body': {
        type: 'string'
      },
      'stack-policy-during-update-url': {
        type: 'string'
      },
      'wait': {
        type: 'boolean', 
        default: undefined
      },
      'enable-termination-protection': {
        type: 'boolean',
        default: undefined
      }
    })
    .implies('accesskeyid', 'secretkey')
    .implies('secretkey', 'accesskeyid')
    .conflicts('template-body', 'template-url')
    .conflicts('stack-policy-body', 'stack-policy-url')
    .showHelpOnFail(false, 'Something went wrong! run with --help or -h')
    .version()
    .parse(argv);
};

module.exports = {
  cliopts: cliopts
};

