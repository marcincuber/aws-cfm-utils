'use strict';

const describeAutoScallingGroup = async (asg, asgname) => {
  let data;
  try {
    data = await asg.describeAutoScalingGroups({ AutoScalingGroupNames: [ asgname ] }).promise();
    return data.AutoScalingGroups[0].SuspendedProcesses;
  } 
  catch (err) {
    return err.stack;
  }
};

module.exports = {
  describeAutoScallingGroup: describeAutoScallingGroup
};