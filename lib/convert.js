'use strict';

// ParameterKey=string,ParameterValue=string,UsePreviousValue=boolean
const opt_params = (param) => {
  const retrived_param = {};
  const pairs = param.split(',').map((pair) => pair.split('='));

  pairs.forEach((pair) => {
    if (pair[0] === 'ParameterKey') {
      retrived_param.ParameterKey = pair[1];
    } 
    else if (pair[0] === 'ParameterValue') {
      retrived_param.ParameterValue = pair[1];
    } 
    else if (pair[0] === 'UsePreviousValue') {
      retrived_param.UsePreviousValue = pair[1] === 'true';
    } 
    else {
      throw new Error('Missing ParameterKey, ParameterValue or UsePreviousValue');
    }
  });

  return retrived_param;
};

const opt_string = (value) => {
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
