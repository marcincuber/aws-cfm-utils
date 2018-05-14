'use strict';

const describestackevents = async (cfm, stackname) => {
  try {
    let events = await cfm.describeStackEvents({ StackName: stackname }).promise();
    return (events.StackEvents);
  }
  catch (err) {
    return (err);
  }
};

const returnstackevents = async (cfm, stackname, process_timestamp) => {
  let stackevents;
  let events;

  try {
    stackevents = await describestackevents(cfm, stackname);

    events = stackevents
      .filter((eventime) => {
        return eventime.Timestamp.toISOString() >= process_timestamp;
      })
      .map((event) => { 
        return {
          TimeStamp: event.Timestamp,
          ResourceStatus: event.ResourceStatus,
          Type: event.ResourceType, 
          LogicalID: event.LogicalResourceId,
          Reason: event.ResourceStatusReason
        };
      });
    return events;
  }
  catch (err) {
    return (err);
  }
};

module.exports = {
  describestackevents: describestackevents,
  returnstackevents: returnstackevents
};