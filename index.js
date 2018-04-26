#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs');

const { version } = require(__dirname + '/package.json');

const deletion_timeout = 1800000; //30 mins
const create_timeout = 3600000; //60 mins
const update_timeout = 3600000; //60 mins

const sleep = require('util').promisify(setTimeout);

AWS.config.update({
  region: 'eu-west-1'
});

const cfm = new AWS.CloudFormation();

const readjsonfile = (filename) => {
  const file_dir = __dirname + '/' + filename;
  const file_content = fs.readFileSync(file_dir, 'utf8'); //JSON.parse(fs.readFileSync(file_dir, 'utf8'));

  return file_content;
};

//Function: describe cfm stack status
const describestack = async (stackname) => {
  let data;
  try {
    data = await cfm.describeStacks({ StackName: stackname }).promise();
    return data.Stacks[0].StackStatus;
  } 
  catch (err) {
    return err.statusCode;
  }
};

//Function: change stackprotection on the stack
const stackprotection = async (stackname, termination) => {
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

//Function: createstack
const createstack = async (cfm, stackname, template, policy) => {
  console.log('Creating stack: ' + stackname);

  let data;
  let count = 0;
  let stack_status = await describestack(stackname);

  const params = {
    StackName: stackname,
    Capabilities: [ 'CAPABILITY_NAMED_IAM' ],
    EnableTerminationProtection: true,
    StackPolicyBody: policy,
    TemplateBody: template
  };

  try {
    data = await cfm.createStack(params).promise();
    console.log(data);
  } 
  catch (err) {
    console.error('Exiting with error: ' + err.stack);
    process.exit(2);
  }

  while (stack_status == 'CREATE_IN_PROGRESS' || stack_status == 400) {
    count = count++;
    stack_status = await describestack(stackname);
    console.log('CFM stack status: ', stack_status);

    if (count > create_timeout * 60 / 10) {
      console.log('Aborting - Timeout while creating!');
      process.exit(1);
    } 
    else {
      console.log('Waiting...');
      await sleep(15000); //15 secs
    }
  }

  if (stack_status != 'CREATE_COMPLETE') {
    console.log('Failure - Stack creation unsuccessful!');
    process.exit(1);
  }

  console.log('Success - Stack Creation successful!');
  process.exit(0);
};

//Function: updatestack
const updatestack = async (cfm, stackname, template, policy) => {
  console.log('Updating stack: ' + stackname);

  const params = {
    StackName: stackname,
    Capabilities: [ 'CAPABILITY_NAMED_IAM' ],
    StackPolicyBody: policy,
    TemplateBody: template
  };

  let data;
  try {
    data = await cfm.updateStack(params).promise();
    console.log(data);
  } 
  catch (err) {
    if (err == 'ValidationError: No updates are to be performed.') { 
      console.log('Update not required. No changes to the cfm stack! ' + err + '\n');
      process.exit(0);
    }
    console.error('Exiting with error type: ' + err.stack);
    process.exit(2);
  }

  let stack_status = await describestack(stackname);
  let count = 0;
  //Wait for stack update
  while (stack_status == 'UPDATE_IN_PROGRESS' || stack_status == 'CREATE_COMPLETE' || stack_status == 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS') {
    count = count++;
    stack_status = await describestack(stackname);
    console.log('CFM stack status: ', stack_status);

    if (count > update_timeout * 60 / 10) {
      console.log('Aborting - Timeout while updating');
      process.exit(1);
    } else {
      console.log('Waiting...');
      await sleep(15000); //15 sec
    }
  }

  if (stack_status != 'UPDATE_COMPLETE') {
    console.log('Failure - Stack update unsuccessful');
    process.exit(1);
  }

  console.log('Success - Stack Updated successfully! \n');
  process.exit(0);
};

//Function: deletestack
const deletestack = async (cfm, stackname) => {
  console.log('Deleting stack: ' + stackname);

  const params = {
    StackName: stackname
  };

  let data;
  try {
    data = await cfm.deleteStack(params).promise();
    console.log(data);
  } 
  catch (err) {
    if (err == 'ValidationError: Stack [' + stackname + '] cannot be deleted while TerminationProtection is enabled') {
      console.log('Termination Protection is enabled on the stack! \n');
      console.log('Disabling Termination Protection on ' + stackname + '\n');
      await stackprotection(stackname, false);
      console.log('Trigger deployment of the stack again. Exiting...\n');
      process.exit(0);
    }

    console.error('Exiting with error: ' + err.stack);
    process.exit(2);
  }

  let stack_status = await describestack(stackname);
  let count = 0;
  //Wait for stack delete
  while (stack_status != 400) {
    count = count++;
    stack_status = await describestack(stackname);
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

const main = async (cfm, stackname, template, policy) => {
  const stack_status = await describestack(stackname);

  if (stack_status != 400) {
    try {
      console.log('Stack: ' + stackname + ' exists! Status: ' + stack_status);
      switch (stack_status) {
      case 'CREATE_COMPLETE':
        await updatestack(cfm, stackname, template, policy);
        break;
      case 'UPDATE_COMPLETE':
        await updatestack(cfm, stackname, template, policy);
        break;
      case 'ROLLBACK_COMPLETE':
        await updatestack(cfm, stackname, template, policy);
        break;
      case 'UPDATE_ROLLBACK_COMPLETE':
        await updatestack(cfm, stackname, template, policy);
        break;
      case 'UPDATE_ROLLBACK_FAILED':
        await updatestack(cfm, stackname, template, policy);
        break;
      case 'CREATE_FAILED':
        await deletestack(cfm, stackname);
        await createstack(cfm, stackname, template, policy);
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
      console.log('Stack: ' + stackname + ' does not exist, creating new one!');
      await createstack(cfm, stackname, template, policy);
    } 
    catch (err) {
      console.error('Exiting with error: ' + err.stack);
      process.exit(2);
    }
  }
};

//Parse command line options
const argv = require('yargs') // eslint-disable-line
  .usage('Usage: $0 [options]')
  .example('$0 -n stackname -t cfmtemplate -p stackpolicy','Create/update stack using AWS default credentials')
  .example('$0 -n stackname -t cfmtemplate -p stackpolicy -k accesskeyid -s secretkey','Create/update stack using provided credentials')
  .example('$0 --name stackname --template cfmtemplate --stackpolicy stackpolicy')
  .example('$0 --name stackname --template cfmtemplate --stackpolicy stackpolicy --accesskeyid accesskeyid --secretkey secretkey')
  .alias('n', 'name')
  .nargs('n', 1)
  .describe('n', 'AWS stack name')
  .alias('t', 'template')
  .nargs('t', 1)
  .describe('t', 'CFM template file name')
  .alias('p', 'stackpolicy')
  .nargs('p', 1)
  .describe('p', 'Stack policy file name')
  .demandOption(['n', 't', 'p'])
  .string(['n', 't', 'p'])
  .describe('k', 'Your AWS access key')
  .alias('k', 'accesskeyid')
  .describe('s', 'Your AWS secret key')
  .alias('s', 'secretkey')
  .string(['k', 's'])
  .implies('k', 's')
  .version(version)
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Something went wrong! run with --help or -h')
  .argv;

const stackname = argv.name;
const template = readjsonfile(argv.template);
const policy = readjsonfile(argv.stackpolicy);

main(cfm, stackname, template, policy);
