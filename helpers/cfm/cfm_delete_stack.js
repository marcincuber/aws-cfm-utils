'use strict';

const deletestack = async (cfm, args) => {
  const { describestack } = require('./cfm_describe_stack.js');
  const { stackprotection } = require('./cfm_termination_protection.js');
  const { returnstackevents } = require('./cfm_describe_stack_events.js');
  const sleep = require('util').promisify(setTimeout);
  // eslint-disable-next-line no-alert, quotes, semi, no-unused-vars
  const cTable = require('console.table');
  
  const deletion_timeout = 1800000; //30 mins
  const refresh_rate = args.refreshRate * 1000; //convert to ms
  const process_start_timestamp = new Date().toISOString();

  console.log('Deleting stack: ' + args.stackName);

  let stack_events;
  let count = 0;

  const params = {
    StackName: args.stackName
  };

  try {
    await cfm.deleteStack(params).promise();
  } 
  catch (err) {
    if (err == 'ValidationError: Stack [' + args.stackName + '] cannot be deleted while TerminationProtection is enabled') {
      console.log('Termination Protection is enabled on the stack! \n');
      console.log('Disabling Termination Protection on ' + args.stackName + '\n');
      await stackprotection(cfm, args.stackName, false);
      console.log('Trigger deployment of the stack again. Exiting...\n');
      process.exit(0);
    }

    console.error('Exiting with error: ' + err.stack);
    process.exit(2);
  }

  let stack_status = await describestack(cfm, args.stackName);

  //Wait for stack delete
  while (stack_status != 400) {
    count = count++;
    stack_status = await describestack(cfm, args.stackName);
    console.log('CFM stack status: ', stack_status);

    if (count > deletion_timeout * 60 / 5) {
      console.log('Aborting - Timeout while deleting');
      process.exit(1);
    } 
    else {
      if (args.stackEvents === true) {
        stack_events = await returnstackevents(cfm, args.stackName, process_start_timestamp);
        console.table('\n' + 'Stack Events for stack: ' + args.stackName, stack_events);
      }
      console.log('Waiting...');
      await sleep(refresh_rate);
    }
  }

  console.log('Success - Stack Deleted successfully!');
};

module.exports = {
  deletestack: deletestack
};
