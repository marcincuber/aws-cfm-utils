'use strict';

const processopts = (argv) => {
  const fs = require('fs');
  const {
    opt_params,
    opt_string,
    opt_tag
  } = require('./convert.js');

  const argexists = (arg) => {
    return argv[arg] !== undefined;
  };

  const argboolean = (arg) => {
    return argv[arg] === true;
  };

  const argstring = (arg) => {
    const val = argv[arg];
    if (val.length === 0) {
      console.error(`${arg} needs to be a string`);
      /* istanbul ignore next */ 
      process.exit(1);
    }
    return val;
  };

  const argint = (arg) => {
    const val = argv[arg];
    if (val < 0) {
      console.error(`${arg} needs to be a positive int`);
      /* istanbul ignore next */ 
      process.exit(1);
    }
    return val;
  };

  const checkfile = (val) => {
    return (val.startsWith('file://'));
  };

  const readfile = (filevalue) => {
    return checkfile(filevalue) ? fs.readFileSync(filevalue.slice(7), 'utf8') : filevalue;
  };

  const listargs = (arg, func) => {
    const vals = argv[arg];
    if (vals.length === 0) {
      console.error(`${arg} needs to be an array with items`);
      /* istanbul ignore next */ 
      process.exit(1);
    }
    return vals.map((val, i) => {
      try {
        return func(val);
      }
      catch (err) {
        console.error(`${arg}[${i}] ${err.message}`);
        /* istanbul ignore next */ 
        process.exit(1);
      }
    });
  };

  const args = {};

  if (argexists('stack-name')) {
    args.stackName = argstring('stack-name');
  }
  if (argexists('template-body')) {
    args.templateBody = readfile(argstring('template-body'));
  }
  if (argexists('template-url')) {
    args.templateUrl = argstring('template-url');
  }
  if (argexists('parameters')) {
    try {
      args.parameters = JSON.parse(argv.parameters[0]);
    }
    catch (err) {
      if (checkfile(argv.parameters[0])) {
        args.parameters = JSON.parse(readfile(argv.parameters[0]));
      }
      else {
        args.parameters = listargs('parameters', opt_params);
      }
    }
  }
  if (argexists('enable-termination-protection')) {
    args.enableTerminationProtection = argboolean('enable-termination-protection');
  }
  if (argexists('capabilities')) {
    args.capabilities = listargs('capabilities', opt_string);
  }
  if (argexists('resource-types')) {
    args.resourceTypes = listargs('resource-types', opt_string);
  }
  if (argexists('role-arn')) {
    args.roleArn = argstring('role-arn');
  }
  if (argexists('stack-policy-body')) {
    args.stackPolicyBody = readfile(argstring('stack-policy-body'));
  }
  if (argexists('stack-policy-url')) {
    args.stackPolicyUrl = argstring('stack-policy-url');
  }
  if (argexists('notification-arns')) {
    args.notificationArns = listargs('notification-arns', opt_string);
  }
  if (argexists('tags')) {
    try {
      args.tags = JSON.parse(argv.tags[0]);
    }
    catch (err) {
      if (checkfile(argv.tags[0])) {
        args.tags = JSON.parse(readfile(argv.tags[0]));
      }
      else {
        args.tags = listargs('tags', opt_tag);
      }
    }
  }
  if (argexists('disable-rollback')) {
    args.disableRollback = argboolean('disable-rollback');
  }
  if (argexists('timeout-in-minutes')) {
    args.timeoutInMinutes = argint('timeout-in-minutes');
  }
  if (argexists('on-failure')) {
    args.onFailure = argstring('on-failure');
  }
  if (argexists('use-previous-template')) {
    args.UsePreviousTemplate = argboolean('use-previous-template');
  }
  if (argexists('stack-policy-during-update-body')) {
    args.stackPolicyDuringUpdateBody = readfile(argstring('stack-policy-during-update-body'));
  }
  if (argexists('stack-policy-during-update-url')) {
    args.stackPolicyDuringUpdateUrl = argstring('stack-policy-during-update-url');
  }
  if (argexists('accesskeyid')) {
    args.accesskeyid = argstring('accesskeyid');
  }
  if (argexists('secretkey')) {
    args.secretkey = argstring('secretkey');
  }
  if (argexists('profile')) {
    args.profile = argstring('profile');
  }
  if (argexists('region')) {
    args.region = argstring('region');
  }
  if (argexists('stack-events')) {
    args.stackEvents = argboolean('stack-events');
  }

  return args;
};

module.exports = {
  processopts: processopts
};