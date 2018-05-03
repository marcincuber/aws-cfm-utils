'use strict';

const deletestack = async (cfm, stackname) => {
  const { describestack } = require('./cfm_describe_stack.js');
  const { stackprotection } = require('./cfm_termination_protection.js');
  const sleep = require('util').promisify(setTimeout);
  
  const deletion_timeout = 1800000; //30 mins

  console.log('Deleting stack: ' + stackname);

  let data;
  let count = 0;
  let stack_status = await describestack(cfm, stackname);

  const params = {
    StackName: stackname
  };

  try {
    data = await cfm.deleteStack(params).promise();
    console.log(data);
  } 
  catch (err) {
    if (err == 'ValidationError: Stack [' + stackname + '] cannot be deleted while TerminationProtection is enabled') {
      console.log('Termination Protection is enabled on the stack! \n');
      console.log('Disabling Termination Protection on ' + stackname + '\n');
      await stackprotection(cfm, stackname, false);
      console.log('Trigger deployment of the stack again. Exiting...\n');
      process.exit(0);
    }

    console.error('Exiting with error: ' + err.stack);
    process.exit(2);
  }

  //Wait for stack delete
  while (stack_status != 400) {
    count = count++;
    stack_status = await describestack(cfm, stackname);
    console.log('CFM stack status: ', stack_status);

    if (count > deletion_timeout * 60 / 5) {
      console.log('Aborting - Timeout while deleting');
      process.exit(1);
    } 
    else {
      console.log('Waiting...');
      await sleep(15000); //15 secs
    }
  }

  console.log('Success - Stack Deleted successfully!');
};

module.exports = {
  deletestack: deletestack
};
