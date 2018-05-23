'use strict';

const resumeScheduledActions = async (asg, cfm, stackname) => {
  const { getAutoScalingGroups } = require('../cfm/get_auto_scalling_groups.js');
  const { describeAutoScallingGroup } = require('./describe_autoscalling_group.js');
  const sleep = require('util').promisify(setTimeout);

  const autoScalingGroups = await getAutoScalingGroups(cfm, stackname);

  autoScalingGroups.forEach(async (group) => {
    let asgStatus;

    asgStatus = await describeAutoScallingGroup(asg, group);

    await asg.resumeProcesses({
      AutoScalingGroupName: group, ScalingProcesses: ['ScheduledActions']
    }).promise();

    await sleep(1000);
    asgStatus = await describeAutoScallingGroup(asg, group);

    if (asgStatus == undefined || asgStatus === '' || asgStatus.length === 0) {
      console.log('Resumed ASG ScheduledActions in: ' + group);
    }
  });

  await sleep(10000);
};

module.exports = {
  resumeScheduledActions: resumeScheduledActions
};