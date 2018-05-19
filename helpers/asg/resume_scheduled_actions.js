'use strict';

const resumeScheduledActions = async (asg, cfm, stackname) => {
  const { getAutoScalingGroups } = require('../cfm/get_auto_scalling_groups.js');
  const { describeAutoScallingGroup } = require('./describe_autoscalling_group.js');

  try {
    const autoScalingGroups = await getAutoScalingGroups(cfm, stackname);

    autoScalingGroups.forEach(async (group) => {
      let asgStatus;

      try {
        asgStatus = await describeAutoScallingGroup(asg, group);
        while (asgStatus[0].ProcessName === 'ScheduledActions') {
          console.log('Resuming ASG ScheduledActions in: ' + group);
          
          await asg.resumeProcesses({
            AutoScalingGroupName: group, ScalingProcesses: ['ScheduledActions']
          }).promise();

          asgStatus = await describeAutoScallingGroup(asg, group);
        }
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