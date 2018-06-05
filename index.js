#!/usr/bin/env node

const AWS = require('aws-sdk');
const proxy = require('proxy-agent');

const { prexit } = require('./pre-exit.js');
const { cliopts } = require('./lib/cli_options.js');
const { processopts } = require('./lib/process_cli_options.js');

const { describestack } = require('./helpers/cfm/cfm_describe_stack.js'); //describestack(cfm, stackname)
const { deletestack } = require('./helpers/cfm/cfm_delete_stack.js'); //deletestack(cfm, stackname)
const { createstack } = require('./helpers/cfm/cfm_create_stack.js'); //createstack(cfm, args)
const { updatestack } = require('./helpers/cfm/cfm_update_stack.js'); //updatestack(cfm, args)

const cfmclient = (args) => {
  const options = {
    apiVersion: '2010-05-15',
    region: args.region
  };

  if (process.env.AWS_DEFAULT_REGION !== undefined && process.env.AWS_REGION === undefined) {
    process.env.AWS_REGION = process.env.AWS_DEFAULT_REGION;
  }

  if (process.env.HTTPS_PROXY) {
    options.httpOptions = {agent: proxy(process.env.HTTPS_PROXY)};
  }

  if (args.profile !== undefined) {
    options.credentials = new AWS.SharedIniFileCredentials({profile: args.profile});
  }

  if (args.accesskeyid !== undefined && args.secretkey !== undefined) {
    options.accessKeyId = args.accesskeyid;
    options.secretAccessKey = args.secretkey;
  }

  return new AWS.CloudFormation(options);
};

const asgclient = (args) => {
  const options = {
    apiVersion: '2011-01-01',
    region: args.region
  };

  if (process.env.AWS_DEFAULT_REGION !== undefined && process.env.AWS_REGION === undefined) {
    process.env.AWS_REGION = process.env.AWS_DEFAULT_REGION;
  }

  if (process.env.HTTPS_PROXY) {
    options.httpOptions = {agent: proxy(process.env.HTTPS_PROXY)};
  }

  if (args.profile !== undefined) {
    options.credentials = new AWS.SharedIniFileCredentials({profile: args.profile});
  }

  if (args.accesskeyid !== undefined && args.secretkey !== undefined) {
    options.accessKeyId = args.accesskeyid;
    options.secretAccessKey = args.secretkey;
  }

  return new AWS.AutoScaling(options);
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

// Create AWS.CloudFormation and AWS.AutoScaling clients
const asg = asgclient(args);
const cfm = cfmclient(args);

// Pre-exit scripts, clean-up script
prexit(cfm, args.stackName);

// Create/Update cloudformation stack using input args and cfm client
main(asg, cfm, args);
