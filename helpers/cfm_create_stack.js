'use strict';

const createstack = async (cfm, args) => {
  const { describestack } = require('./cfm_describe_stack.js');
  const sleep = require('util').promisify(setTimeout);
  
  const create_timeout = 3600000; //60 mins

  console.log('Creating stack: ' + args.stackName);

  let data;
  let count = 0;
  let stack_status = await describestack(cfm, args.stackName);

  const params = {
    StackName: args.stackName
  };

  if (args.capabilities !== undefined) {
    params.Capabilities = args.capabilities;
  }
  if (args.disableRollback !== undefined) {
    params.DisableRollback = args.disableRollback;
  }
  if (args.enableTerminationProtection !== undefined) {
    params.EnableTerminationProtection = args.enableTerminationProtection; 
  }
  if (args.notificationArns !== undefined) {
    params.NotificationARNs = args.notificationArns;
  }
  if (args.onFailure !== undefined) {
    params.OnFailure = args.onFailure;
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
  if (args.timeoutInMinutes !== undefined) {
    params.TimeoutInMinutes = args.timeoutInMinutes;
  }

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
    stack_status = await describestack(cfm, args.stackName);
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

module.exports = {
  createstack: createstack
};
