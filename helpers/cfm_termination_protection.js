'use strict';

const stackprotection = async (cfm, stackname, termination) => {
  console.log('Changing termination protection on stack: ' + stackname);

  const params = {
    EnableTerminationProtection: termination,
    StackName: stackname
  };

  try {
    await cfm.updateTerminationProtection(params).promise();
  } 
  catch (err) {
    console.error('Exiting with error: ' + err.stack);
    process.exit(2);
  }

  console.log('Termination Protection set to ' + termination + ' on stack: ' + stackname + '\n');
};

module.exports = {
  stackprotection: stackprotection
};