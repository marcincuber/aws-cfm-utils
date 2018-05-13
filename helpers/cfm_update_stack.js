'use strict';

const updatestack = async (cfm, args) => {
  const { describestack } = require('./cfm_describe_stack.js');
  const { describestackevents, returnstackevents } = require('./cfm_describe_stack_events.js');
  const sleep = require('util').promisify(setTimeout);
  const cTable = require('console.table');
  
  const update_timeout = 3600000; //60 mins
  const process_start_timestamp = new Date().toISOString();

  let data;
  let stack_events;
  let count = 0;

  
  const params = {
    StackName: args.stackName,
    Capabilities: args.capabilities || null,
    NotificationARNs: args.notificationArns || null,
    ResourceTypes: args.resourceTypes || null,
    RoleARN: args.roleArn || null,
    StackPolicyBody: args.stackPolicyBody || null,
    StackPolicyDuringUpdateBody: args.stackPolicyDuringUpdateBody || null,
    StackPolicyDuringUpdateURL: args.stackPolicyDuringUpdateUrl || null,
    StackPolicyURL: args.stackPolicyUrl || null,
    TemplateBody: args.templateBody || null,
    TemplateURL: args.templateUrl || null,
    UsePreviousTemplate: args.UsePreviousTemplate || null
  };

  if (args.parameters !== undefined) {
    params.Parameters = args.parameters.map((parameter) => {
      const ret = {
        ParameterKey: parameter.ParameterKey
      };
      if (parameter.ParameterValue !== undefined) {
        ret.ParameterValue = parameter.ParameterValue;
      }
      if (parameter.UsePreviousValue !== undefined) {
        ret.UsePreviousValue = parameter.UsePreviousValue;
      }
      return ret;
    });
  }
  if (args.tags !== undefined) {
    params.Tags = args.tags.map((tag) => ({
      Key: tag.Key,
      Value: tag.Value
    }));
  }

  try {
    data = await cfm.updateStack(params).promise();
  } 
  catch (err) {
    if (err == 'ValidationError: No updates are to be performed.') { 
      console.log('Update not required. No changes to the cfm stack! ' + err + '\n');
      process.exit(0);
    }
    console.error('Exiting with error type: ' + err.stack);
    process.exit(2);
  }

  let stack_status = await describestack(cfm, args.stackName);

  //Wait for stack update
  while (stack_status === 'UPDATE_IN_PROGRESS' || 
    stack_status === 'CREATE_COMPLETE' || 
    stack_status === 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS' || 
    stack_status === 'UPDATE_ROLLBACK_COMPLETE' ||
    stack_status === 'UPDATE_ROLLBACK_FAILED') {
    
    count = count++;
    stack_status = await describestack(cfm, args.stackName);
    console.log('CFM stack status: ', stack_status);

    if (count > update_timeout * 60 / 10) {
      console.log('Aborting - Timeout while updating');
      process.exit(1);
    } 
    else {
      if (args.stackEvents === true) {
        let stack_events = await returnstackevents(cfm, args.stackName, process_start_timestamp);
        console.table('Stack Events for stack: ' + args.stackName, stack_events);
      }

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

module.exports = {
  updatestack: updatestack
};