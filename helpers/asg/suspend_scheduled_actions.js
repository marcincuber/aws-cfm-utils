'use strict';

const suspendScheduledActions = async (asg, cfm, stackname) => {
  const { getAutoScalingGroups } = require('../cfm/get_auto_scalling_groups.js');
  const { describeAutoScallingGroup } = require('./describe_autoscalling_group.js');
  const sleep = require('util').promisify(setTimeout);

  const asg_timeout = 600000; //10 mins

  try {
    const autoScalingGroups = await getAutoScalingGroups(cfm, stackname);

    autoScalingGroups.forEach(async (group) => {
      let asgStatus;
      let count = 0;
      
      try {
        await asg.suspendProcesses({
          AutoScalingGroupName: group, ScalingProcesses: ['ScheduledActions']
        }).promise();

        asgStatus = await describeAutoScallingGroup(asg, group);

        while (asgStatus[0].ProcessName !== 'ScheduledActions') {
          console.log('Waiting for asg ScheduledActions suspension');
          count = count++;
          asgStatus = await describeAutoScallingGroup(asg, group);

          if (count > asg_timeout * 60 / 10) {
            console.error('Aborting - Timeout while suspending ASG!');
            process.exit(1);
          } 
          else {
            await sleep(1000);
          }
        }

        asgStatus = await describeAutoScallingGroup(asg, group);

        if (asgStatus[0].ProcessName === 'ScheduledActions') {
          console.log('Suspended ASG ScheduledActions in: ' + group);
        }
      }
      catch (err) {
        console.error(err);
      }
    });
  }
  catch (err) {
    console.error(err);
  }
};

module.exports = {
  suspendScheduledActions: suspendScheduledActions
};