'use strict';

const describestack = async (cfm, stackname) => {
  let data;
  try {
    data = await cfm.describeStacks({ StackName: stackname }).promise();
    return data.Stacks[0].StackStatus;
  } 
  catch (err) {
    return err.statusCode;
  }
};

module.exports = {
  describestack: describestack
};