'use strict';

const prexit = async (cfm, stackname) => {
  const { describestack } = require('./helpers/cfm/cfm_describe_stack.js');
  const sleep = require('util').promisify(setTimeout);
  const rollback_timeout = 600000;

  const beforeExitStackCheck = async (cfm, stackname) => {
    let stack_status = await describestack(cfm, stackname);
    let count = 0;

    console.log('Stack in: ' + stack_status + ' state.');
    
    if (stack_status === 'UPDATE_ROLLBACK_FAILED') {
      try {
        await cfm.continueUpdateRollback({ StackName: stackname }).promise();
      } 
      catch (err) {
        console.error('Exiting with error: ' + err.stack);
        process.exit(2);
      }
    }
    if (stack_status === 'UPDATE_IN_PROGRESS') {
      try {
        await cfm.cancelUpdateStack({ StackName: stackname }).promise();
      } 
      catch (err) {
        console.error('Exiting with error: ' + err.stack);
        process.exit(2);
      }
    }

    while (stack_status === 'UPDATE_IN_PROGRESS' || 
    stack_status === 'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS' ||
    stack_status === 'UPDATE_ROLLBACK_IN_PROGRESS') {
      
      count = count++;
      stack_status = await describestack(cfm, stackname);
      if (count > rollback_timeout * 60 / 10) {
        console.log('Aborting - Timeout while rolling back!');
        process.exit(1);
      } 
      else {
        console.log('Waiting...');
        await sleep(10000); 
      }
    }

    if (stack_status === 'UPDATE_ROLLBACK_COMPLETE') {
      console.log('Rollback Completed. Exiting.');
    }
    if (stack_status === 'UPDATE_ROLLBACK_FAILED') {
      console.log('Rollback Failed! Exiting.');
    }
    if (stack_status === 'CREATE_IN_PROGRESS') {
      console.log('Stack is still creating. Review the stack in AWS console. Exiting.');
    }
  };

  // Catch exit
  process.stdin.resume();

  process.on('exit', () => {
    process.exit(0);
  });

  // Catch CTRL+C
  process.on('SIGINT', async () => {
    console.log('\nCTRL+C...');
    await beforeExitStackCheck(cfm, stackname);
    process.exit(0);
  });

  // Catch uncaught exception
  process.on('uncaughtException', (err) => {
    console.dir(err, { depth: null });
    process.exit(1);
  });
};

module.exports = {
  prexit: prexit
};