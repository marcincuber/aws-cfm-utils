'use strict';

const getStackNames = async (cfm, stackname) => {
  let data;
  try {
    data = await cfm.describeStackResources({ StackName: stackname }).promise();
    return data.StackResources
      .filter((resource) => resource.ResourceType === 'AWS::CloudFormation::Stack')
      .map((resourceval) => resourceval.PhysicalResourceId.replace(/^.+:stack\//, '').match(/.+?(?=\/)/g));
  }
  catch (err) {
    return err.stack;
  }
};

module.exports = {
  getStackNames: getStackNames
};