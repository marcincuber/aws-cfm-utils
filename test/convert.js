'use strict';

const assert = require('assert');
const convert = require('../lib/convert.js');

describe('convert', () => {
  describe('parameter', () => {
    it('ParameterKey=key,UsePreviousValue=true', () => {
      assert.deepEqual(convert.opt_params('ParameterKey=key,UsePreviousValue=true'), {
        ParameterKey: 'key',
        UsePreviousValue: true
      });
    });
    it('ParameterKey=key,UsePreviousValue=false', () => {
      assert.deepEqual(convert.opt_params('ParameterKey=key,UsePreviousValue=false'), {
        ParameterKey: 'key',
        UsePreviousValue: false
      });
    });
    it('ParameterKey=key,ParameterValue=value', () => {
      assert.deepEqual(convert.opt_params('ParameterKey=key,ParameterValue=value'), {
        ParameterKey: 'key',
        ParameterValue: 'value'
      });
    });
    it('ParameterKey=key,Unexpected=value', () => {
      assert.throws(() => {
        convert.opt_params('ParameterKey=key,Unexpected=value');
      }, Error);
    });
  });
  describe('tag', () => {
    it('Key=key,Value=value', () => {
      assert.deepEqual(convert.opt_tag('Key=key,Value=value'), {
        key: 'key',
        value: 'value'
      });
    });
    it('Key=key,Unexpected=value', () => {
      assert.throws(() => {
        convert.opt_params('Key=key,Unexpected=value');
      }, Error);
    });
  });
  describe('String value', () => {
    it('value', () => {
      assert.deepEqual(convert.opt_string('value'), 'value');
    });
    it('Empty string', () => {
      assert.throws(() => {
        convert.opt_string();
      }, Error);
    });
  });
});