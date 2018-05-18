'use strict';

const resumeScheduledActions = async (asg, cfm, stackname) => {
  const { getAutoScalingGroups } = require('../cfm/get_auto_scalling_groups.js');

  try {
    const autoScalingGroups = await getAutoScalingGroups(cfm, stackname);

    autoScalingGroups.forEach(async (group) => {
      try {
        await asg.resumeProcesses({
          AutoScalingGroupName: group, ScalingProcesses: ['ScheduledActions']
        }).promise();
      }
      catch (err) {
        return err.stack;
      }
    });
  }
  catch (err) {
    return err.stack;
  }
};

module.exports = {
  resumeScheduledActions: resumeScheduledActions
};