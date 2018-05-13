'use strict';

const opt_params = (param) => {
  const param_arr = param.match(/(\s*([^,]+)".*?"|\s*([^,]+)[^",\s]+)(?=\s*,|\s*$)/g);
  
  return param_arr.reduce((retrieved, pair) => {
    const [key_name, key_value] = pair.split(/=(.+)?/);

    if (key_name === 'ParameterKey') {
      retrieved.ParameterKey = key_value;
    } 
    else if (key_name === 'ParameterValue') {
      retrieved.ParameterValue = key_value.replace(/(^"|"$)/g, '');
    } 
    else if (key_name === 'UsePreviousValue') {
      retrieved.UsePreviousValue = key_value === 'true';
    } 
    else {
      throw new Error('Missing ParameterKey, ParameterValue or UsePreviousValue');
    }

    return retrieved;
  }, {});
};

const opt_string = (value) => {
  if (value.length === 0) {
    throw new Error('Provided value is not a string');
  }

  return value;
};

const opt_tag = (tag) => {
  const retrived_tag = {};
  const tag_arr = tag.match(/(\s*([^,]+)".*?"|\s*([^,]+)[^",\s]+)(?=\s*,|\s*$)/g); //same regex as in param_arr

  tag_arr.forEach((tag) => {
    const [key_name, key_value] = tag.split(/=(.+)?/);

    if (key_name === 'Key') {
      retrived_tag.Key = key_value;
    } 
    else if (key_name === 'Value') {
      retrived_tag.Value = key_value.replace(/(^"|"$)/g, '');
    } 
    else {
      throw new Error('Missing Key or Value inside tag');
    }
  });

  return retrived_tag;
};

module.exports = {
  opt_params: opt_params,
  opt_string: opt_string,
  opt_tag: opt_tag
};
