'use strict';

const validate = async (cfm, args) => {
  const params = {};

  if (args.templateBody !== undefined) {
    params.TemplateBody = args.templateBody;
  }

  if (args.templateUrl !== undefined) {
    params.TemplateURL = args.templateUrl;
  } 

  try {
    await cfm.validateTemplate(params).promise();
  } 
  catch (err) {
    console.error('Invalid template. Exiting with error: ' + err);
    process.exit(2);
  }
};

module.exports = {
  validate: validate
};