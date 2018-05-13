#!/usr/bin/env node

const prexit = (cfm, stackname) => {
  const { describestack } = require('./helpers/cfm_describe_stack.js');

  // Pre-exit scripts
  let preExit = [];

  // Catch exit
  process.stdin.resume();

  process.on ('exit', (code) => {
    let i;

    console.log ('Process exit');

    for (i = 0; i < preExit.length; i++) {
      preExit[i] (code);
    }

    process.exit(code);
  });

  // Catch CTRL+C
  process.on ('SIGINT', () => {
    console.log ('\nCTRL+C...');
    process.exit (0);
  });

  // Catch uncaught exception
  process.on ('uncaughtException', (err) => {
    console.dir (err, { depth: null });
    process.exit (1);
  });

  // INSERT CODE
  console.log ('App Running');

  // Add pre-exit script
  preExit.push ( async (code) => {
    console.log ('Whoa! Exit code %d, cleaning up...', code);
    const stack_status = await describestack(cfm, stackname);
    console.log('Stack in: ' + stack_status + ' state.');
    
    if (stack_status === 'UPDATE_IN_PROGRESS') {
      try {
        console.log('Canceling stack update.');
        await cfm.cancelUpdateStack({ StackName: stackname }).promise();
      } 
      catch (err) {
        console.error('Exiting with error: ' + err.stack);
        process.exit(2);
      }
    }
    
    if (stack_status === 'UPDATE_ROLLBACK_FAILED') {
      try {
        console.log('Trying to continue Update Rollback.');
        await cfm.continueUpdateRollback({ StackName: stackname }).promise();
      } 
      catch (err) {
        console.error('Exiting with error: ' + err.stack);
        process.exit(2);
      }
    }
  });
};

module.exports = {
  prexit: prexit
};