'use strict';

// ParameterKey=string,ParameterValue=string,UsePreviousValue=boolean
const opt_params = (param) => {
  const retrived_param = {};

  let param_arr = param.match(/(\s*([^,]+)".*?"|\s*([^,]+)[^",\s]+)(?=\s*,|\s*$)/g);
  /* will match:
      (\s*([^,]+)     Any string
      AND
      (
          ".*?"       double quotes + anything but double quotes + double quotes
          |           OR
          [^",\s]+    1 or more characters excl. double quotes, comma or spaces of any kind
      )
      (?=             FOLLOWED BY
          \s*,        0 or more empty spaces and a comma
          |           OR
          \s*$        0 or more empty spaces and nothing else (end of string)
      )
  */
  param_arr = param_arr || [];
  
  param_arr.forEach((pair) => {
    const split_pair = pair.split(/=(.+)?/);

    if (split_pair[0] === 'ParameterKey') {
      retrived_param.ParameterKey = split_pair[1];
    } 
    else if (split_pair[0] === 'ParameterValue') {
      retrived_param.ParameterValue = split_pair[1].replace(/^"(.*)"$/, '$1');
    } 
    else if (split_pair[0] === 'UsePreviousValue') {
      retrived_param.UsePreviousValue = split_pair[1] === 'true';
    } 
    else {
      throw new Error('Missing ParameterKey, ParameterValue or UsePreviousValue');
    }
  });

  return retrived_param;
};

const opt_string = (value) => {
  /* istanbul ignore if */
  if (value.length === 0) {
    throw new Error('Provided value is not a string');
  }

  return value;
};

const opt_tag = (tag) => {
  const retrived_tag = {};
  const pairs = tag.split(',').map((pair) => pair.split('='));

  pairs.forEach((pair) => {
    if (pair[0] === 'Key') {
      retrived_tag.Key = pair[1];
    } 
    else if (pair[0] === 'Value') {
      retrived_tag.Value = pair[1];
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
