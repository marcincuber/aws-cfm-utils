'use strict';

const updatestack = async (asg, cfm, args) => {
  const { describestack } = require('./cfm_describe_stack.js');
  const { returnstackevents } = require('./cfm_describe_stack_events.js');
  const { suspendScheduledActions } = require('../asg/suspend_scheduled_actions.js');
  const { resumeScheduledActions } = require('../asg/resume_scheduled_actions.js');

  const sleep = require('util').promisify(setTimeout);
  // eslint-disable-next-line no-alert, quotes, semi, no-unused-vars
  const cTable = require('console.table');
  
  const update_timeout = 3600000; //60 mins
  const refresh_rate = args.refreshRate * 1000; //convert to ms
  const process_start_timestamp = new Date().toISOString();

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
  if (args.suspendScheduledActions) {
    console.log('Suspending ASG actions...');
    await suspendScheduledActions(asg, cfm, args.stackName);
  }

  try {
    await cfm.updateStack(params).promise();
  } 
  catch (err) {
    if (err == 'ValidationError: No updates are to be performed.') { 
      console.log('Update not required. No changes to the cfm stack! ' + err + '\n');
      if (args.suspendScheduledActions) {
        await resumeScheduledActions(asg, cfm, args.stackName);
      }
      process.exit(0);
    }
    console.error('Exiting with error type: ' + err.stack);
    if (args.suspendScheduledActions) {
      await resumeScheduledActions(asg, cfm, args.stackName);
    }
    process.exit(2);
  }

  let stack_status = await describestack(cfm, args.stackName);

  //Wait for stack update
  while (stack_status === 'UPDATE_IN_PROGRESS' || 
    stack_status === 'CREATE_COMPLETE' || 
    stack_status === 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS') {
    
    count = count++;
    stack_status = await describestack(cfm, args.stackName);
    console.log('CFM stack status: ', stack_status);

    if (count > update_timeout * 60 / 10) {
      console.log('Aborting - Timeout while updating');
      if (args.suspendScheduledActions) {
        await resumeScheduledActions(asg, cfm, args.stackName);
      }
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

  stack_status = await describestack(cfm, args.stackName);

  if (stack_status === 'UPDATE_ROLLBACK_COMPLETE') {
    console.error('Update Failure - Update Rollback Completed successfully!');
    if (args.suspendScheduledActions) {
      await resumeScheduledActions(asg, cfm, args.stackName);
    }
    process.exit(1);
  }

  if (stack_status === 'UPDATE_ROLLBACK_FAILED') {
    console.error('Update Failure - Update Rollback Failed!');
    if (args.suspendScheduledActions) {
      await resumeScheduledActions(asg, cfm, args.stackName);
    }
    process.exit(1);
  }

  if (stack_status != 'UPDATE_COMPLETE') {
    console.error('Failure - Stack update unsuccessful');
    if (args.suspendScheduledActions) {
      await resumeScheduledActions(asg, cfm, args.stackName);
    }
    process.exit(1);
  }

  if (args.suspendScheduledActions) {
    console.log('Resuming ASG actions...');
    await resumeScheduledActions(asg, cfm, args.stackName);
  }
  
  console.log('Success - Stack Updated successfully! \n');
  process.exit(0);
};

module.exports = {
  updatestack: updatestack
};