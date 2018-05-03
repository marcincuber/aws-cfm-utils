'use strict';

const processopts = (argv) => {
  const fs = require('fs');
  const convert = require('./convert.js');
  const path = require('path');

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
      process.exit(1);
    }
    return val;
  };

  const argint = (arg) => {
    const val = argv[arg];

    if (val < 0) {
      console.error(`${arg} needs to be a positive int`);
      process.exit(1);
    }
    return val;
  };

  const readjsonfile = (filename) => {
  	const __parentDir = path.dirname(process.mainModule.filename);
  	const file_dir = __parentDir + '/' + filename;
  	const file_content = fs.readFileSync(file_dir, 'utf8'); //JSON.parse(fs.readFileSync(file_dir, 'utf8'));

  	return file_content;
	};

  const listargs = (arg, fn) => {
    const vals = argv[arg];

    if (vals.length === 0) {
      console.error(`${arg} needs to be an array with items`);
      process.exit(1);
    }
    return vals.convert((val, i) => {
      try {
        return fn(val);
      } catch (err) {
        console.error(`${arg}[${i}] ${err.message}`);
        process.exit(1);
      }
    });
  };

  const args = {};

  if (argexists('stack-name')) {
    args.stackName = argstring('stack-name');
  }

  if (argexists('template-body')) {
    args.templateBody = readjsonfile(argstring('template-body'));
  }
  if (argexists('template-url')) {
    args.templateUrl = argstring('template-url');
  }
  if (argexists('parameters')) {
    try {
      args.parameters = argv.parameters[0];
    } 
    catch (err) {
      try {
      	args.parameters = readjsonfile(argv.parameters[0]);
      }
      catch (err) {
        args.parameters = listargs('parameters', convert.parameter);
      }
    }
  }
  if (argexists('enable-termination-protection')) {
  	 args.enableTerminationProtection = argboolean('enable-termination-protection');
  }
  if (argexists('capabilities')) {
    args.capabilities = listargs('capabilities', convert.argstring);
  }
  if (argexists('resource-types')) {
    args.resourceTypes = listargs('resource-types', convert.argstring);
  }
  if (argexists('role-arn')) {
    args.roleArn = argstring('role-arn');
  }
  if (argexists('stack-policy-body')) {
    args.stackPolicyBody = readjsonfile(argstring('stack-policy-body'));
  }
  if (argexists('stack-policy-url')) {
    args.stackPolicyUrl = argstring('stack-policy-url');
  }
  if (argexists('notification-arns')) {
    args.notificationArns = listargs('notification-arns', convert.argstring);
  }
  if (argexists('tags')) {
    args.tags = listargs('tags', convert.tag);
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
    args.stackPolicyDuringUpdateBody = file(argstring('stack-policy-during-update-body'));
  }
  if (argexists('stack-policy-during-update-url')) {
    args.stackPolicyDuringUpdateUrl = argstring('stack-policy-during-update-url');
  }
  if (argexists('profile')) {
    args.profile = argstring('profile');
  }
  if (argexists('region')) {
    args.region = argstring('region');
  }
  if (argexists('wait')) {
    args.wait = argboolean('wait');
  }
  
  return args;
};

module.exports = {
    processopts: processopts
};