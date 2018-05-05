'use strict';

const createstack = async (cfm, args) => {
  const { describestack } = require('./cfm_describe_stack.js');
  const sleep = require('util').promisify(setTimeout);
  
  const create_timeout = 3600000; //60 mins

  console.log('Creating stack: ' + args.stackName);

  let data;
  let count = 0;

  const params = {
    StackName: args.stackName,
    Capabilities: args.capabilities || null,
    DisableRollback: args.disableRollback || null,
    EnableTerminationProtection: args.enableTerminationProtection || null,
    NotificationARNs: args.notificationArns || null,
    OnFailure: args.onFailure || null,
    ResourceTypes: args.resourceTypes || null,
    RoleARN: args.roleArn || null,
    StackPolicyBody: args.stackPolicyBody || null,
    StackPolicyURL: args.stackPolicyUrl || null,
    TemplateBody: args.templateBody || null,
    TemplateURL: args.templateUrl || null,
    TimeoutInMinutes: args.timeoutInMinutes || null
  };

  if (args.parameters !== undefined) {
    console.log(args.parameters);
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
      Key: tag.key,
      Value: tag.value
    }));
  }

  try {
    data = await cfm.createStack(params).promise();
    console.log(data);
  } 
  catch (err) {
    console.error('Exiting with error: ' + err.stack);
    process.exit(2);
  }

  let stack_status = await describestack(cfm, args.stackName);

  while (stack_status === 'CREATE_IN_PROGRESS' || stack_status === 400) {
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

  if (stack_status !== 'CREATE_COMPLETE') {
    console.log('Failure - Stack creation unsuccessful!');
    process.exit(1);
  }

  console.log('Success - Stack Creation successful!');
  process.exit(0);
};

module.exports = {
  createstack: createstack
};
