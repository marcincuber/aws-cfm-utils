'use strict';

const updatestack = async (cfm, args) => {
  const { describestack } = require('./cfm_describe_stack.js');
  const sleep = require('util').promisify(setTimeout);
  
  const update_timeout = 3600000; //60 mins

  console.log('Updating stack: ' + args.stackName);

  let data;
  let count = 0;
  let stack_status = await describestack(cfm, args.stackName);

  const params = {
    StackName: args.stackName
  };

  if (args.capabilities !== undefined) {
    params.Capabilities = args.capabilities;
  }
  if (args.notificationArns !== undefined) {
    params.NotificationARNs = args.notificationArns;
  }
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
  if (args.resourceTypes !== undefined) {
    params.ResourceTypes = args.resourceTypes;
  }
  if (args.roleArn !== undefined) {
    params.RoleARN = args.roleArn;
  }
  if (args.stackPolicyBody !== undefined) {
    params.StackPolicyBody = args.stackPolicyBody;
  }
  if (args.stackPolicyDuringUpdateBody !== undefined) {
    params.StackPolicyDuringUpdateBody = args.stackPolicyDuringUpdateBody;
  }
  if (args.stackPolicyDuringUpdateUrl !== undefined) {
    params.StackPolicyDuringUpdateURL = args.stackPolicyDuringUpdateUrl;
  }
  if (args.stackPolicyUrl !== undefined) {
    params.StackPolicyURL = args.stackPolicyUrl;
  }
  if (args.tags !== undefined) {
    params.Tags = args.tags.map((tag) => ({
      Key: tag.key,
      Value: tag.value
    }));
  }
  if (args.templateBody !== undefined) {
    params.TemplateBody = args.templateBody;
  }
  if (args.templateUrl !== undefined) {
    params.TemplateURL = args.templateUrl;
  }
  if (args.UsePreviousTemplate !== undefined) {
    params.UsePreviousTemplate = args.UsePreviousTemplate;
  }

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

  //Wait for stack update
  while (stack_status == 'UPDATE_IN_PROGRESS' || stack_status == 'CREATE_COMPLETE' || stack_status == 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS') {
    count = count++;
    stack_status = await describestack(cfm, args.stackName);
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

module.exports = {
  updatestack: updatestack
};