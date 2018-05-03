#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs');

const { cliopts } = require('./lib/cli_options.js');
const { processopts } = require('./lib/process_cli_options.js');

const { describestack } = require('./helpers/cfm_describe_stack.js'); //describestack(cfm, stackname)
const { deletestack } = require('./helpers/cfm_termination_protection.js'); //deletestack(cfm, stackname)
const { createstack } = require('./helpers/cfm_create_stack.js'); //createstack(cfm, args)
const { updatestack } = require('./helpers/cfm_update_stack.js'); //updatestack(cfm, args)

const sleep = require('util').promisify(setTimeout);

if (process.env.AWS_DEFAULT_REGION !== undefined && process.env.AWS_REGION === undefined) {
  process.env.AWS_REGION = process.env.AWS_DEFAULT_REGION;
}

AWS.config.update({
  region: 'eu-west-1',
  apiVersion: '2010-05-15'
});

const cfm = new AWS.CloudFormation();

const main = async (cfm, args) => {
  const stack_status = await describestack(cfm, args.stackName);
  console.log('status: ' + stack_status);

  if (stack_status != 400) {
    try {
      console.log('Stack: ' + args.stackName + ' exists! Status: ' + stack_status);
      switch (stack_status) {
      case 'CREATE_COMPLETE':
        await updatestack(cfm, args);
        break;
      case 'UPDATE_COMPLETE':
        await updatestack(cfm, args);
        break;
      case 'ROLLBACK_COMPLETE':
        await updatestack(cfm, args);
        break;
      case 'UPDATE_ROLLBACK_COMPLETE':
        await updatestack(cfm, args);
        break;
      case 'UPDATE_ROLLBACK_FAILED':
        await updatestack(cfm, args);
        break;
      case 'CREATE_FAILED':
        await deletestack(cfm, args.stackName);
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

const input_args = process.argv;
const args = processopts(cliopts(input_args));

// console.log(args);

main(cfm, args);
