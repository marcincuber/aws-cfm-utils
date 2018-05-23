'use strict';

const getAutoScalingGroups = async (cfm, stackname) => {
  const { getStackNames } = require('./get_all_stack_names.js');

  try {
    const stackNames = await getStackNames(cfm, stackname);
    stackNames.push([stackname]); // add parent stack

    const stackRequests = stackNames.map(async(nestedstackname) =>
      cfm.describeStackResources({ StackName: nestedstackname[0] })
        .promise()
        .then(({ StackResources }) =>
          StackResources
            .filter((resource) => resource.ResourceType === 'AWS::AutoScaling::AutoScalingGroup')
            .map((resourceval) => resourceval.PhysicalResourceId)
        )
    );
    return Promise.all(stackRequests).then(stacks => [].concat(...stacks));
  }
  catch (err) {
    console.error(err);
  }
};

module.exports = {
  getAutoScalingGroups: getAutoScalingGroups
};