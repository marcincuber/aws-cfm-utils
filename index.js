#!/usr/bin/env node

const AWS = require('aws-sdk');
const proxy = require('proxy-agent');
const inquirer = require('inquirer');

const { prexit } = require('./pre-exit.js');
const { cliopts } = require('./lib/cli_options.js');
const { processopts } = require('./lib/process_cli_options.js');

const { describestack } = require('./helpers/cfm/cfm_describe_stack.js'); //describestack(cfm, stackname)
const { deletestack } = require('./helpers/cfm/cfm_delete_stack.js'); //deletestack(cfm, stackname)
const { createstack } = require('./helpers/cfm/cfm_create_stack.js'); //createstack(cfm, args)
const { updatestack } = require('./helpers/cfm/cfm_update_stack.js'); //updatestack(asg, cfm, args)
const { validate } = require('./helpers/cfm/cfm_validate.js'); //validate(cfm, args)

require('dotenv').config();

const tokenCodeFn = (mfa_serial, callback) => {
  inquirer.prompt({
    name: 'mfa_token',
    type: 'input',
    default: '',
    message: `Enter MFA token for ${mfa_serial}:`,
    validate: (value) => {
      if (value) {
        return true;
      }
      return 'Please enter a MFA temporary token';
    }
  }).then((response) => {
    callback(null, response.mfa_token);
  }).catch((err) => {
    console.error(err);
    callback(err);
  });
};

const awsClient = async (args) => {
  // set the API versions
  AWS.config.apiVersions = {
    autoscaling: '2011-01-01',
    cloudformation: '2010-05-15'
  };

  let asg, cfm;
  const options = {};

  if (process.env.AWS_DEFAULT_REGION !== undefined && process.env.AWS_REGION === undefined) {
    process.env.AWS_REGION = process.env.AWS_DEFAULT_REGION;
  }

  if (process.env.HTTPS_PROXY) {
    options.httpOptions = {agent: proxy(process.env.HTTPS_PROXY)};
  }

  if (process.env.AWS_PROFILE !== undefined) {
    options.credentials = new AWS.SharedIniFileCredentials({tokenCodeFn: tokenCodeFn, profile: process.env.AWS_PROFILE});
  } else if (args.profile !== undefined) {
    options.credentials = new AWS.SharedIniFileCredentials({tokenCodeFn: tokenCodeFn, profile: args.profile});
  }

  if (args.region !== undefined) {
    options.region = args.region;
  } 

  if (args.accesskeyid !== undefined && args.secretkey !== undefined) {
    options.accessKeyId = args.accesskeyid;
    options.secretAccessKey = args.secretkey;
  }

  if (args.sessiontoken !== undefined) {
    options.sessionToken = args.sessiontoken;
  }

  try {
    if (args.suspendScheduledActions) {
      asg = await new AWS.AutoScaling(options);
    }
    cfm = await new AWS.CloudFormation(options);
    
    return {asgClient: asg, cfmClient: cfm};
  }
  catch (err) {
    console.error('Exiting with error: ' + err.stack);
    process.exit(2);
  }
};

const main = async (asg, cfm, args) => {
  const stack_status = await describestack(cfm, args.stackName);

  if (stack_status != 400) {
    try {
      console.log('\n' + 'Stack named: ' + args.stackName + ' already exists! Status: ' + stack_status);

      switch (stack_status) {
      case 'CREATE_COMPLETE':
        await updatestack(asg, cfm, args);
        break;
      case 'UPDATE_COMPLETE':
        await updatestack(asg, cfm, args);
        break;
      case 'ROLLBACK_COMPLETE':
        await updatestack(asg, cfm, args);
        break;
      case 'UPDATE_ROLLBACK_COMPLETE':
        await updatestack(asg, cfm, args);
        break;
      case 'UPDATE_ROLLBACK_FAILED':
        await updatestack(asg, cfm, args);
        break;
      case 'CREATE_FAILED':
        await deletestack(cfm, args);
        await createstack(cfm, args);
        break;
      default:
        console.log('Stack not ready - Aborting with Stack Status: ' + stack_status);
        process.exit(1);
      }
    } catch (err) {
      console.error(err.stack);
      process.exit(2);
    }
  } 
  else {
    try {
      console.log('Stack: ' + args.stackName + ' does not exist, creating new one!');
      await createstack(cfm, args);
    } 
    catch (err) {
      console.error('Exiting with error: ' + err.stack);
      process.exit(2);
    }
  }
};

// Collect and transform input options
const input_args = process.argv;
const args = processopts(cliopts(input_args));

(async function() {
  const {asgClient, cfmClient} = await awsClient(args);
  await validate(cfmClient, args);
  await prexit(cfmClient, args.stackName);
  await main(asgClient, cfmClient, args);
})();