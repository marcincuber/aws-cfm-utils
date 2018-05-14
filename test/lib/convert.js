'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { opt_params, opt_string, opt_tag } = require('../../lib/convert.js');

describe('convert', function() {
  describe('parameter', function() {
    it('handles input: ParameterKey=key,UsePreviousValue=true', function() {
      assert.deepEqual(opt_params('ParameterKey=key,UsePreviousValue=true'), {
        ParameterKey: 'key',
        UsePreviousValue: true
      });
    });
    it('handles input: ParameterKey=key,UsePreviousValue=false', function() {
      assert.deepEqual(opt_params('ParameterKey=key,UsePreviousValue=false'), {
        ParameterKey: 'key',
        UsePreviousValue: false
      });
    });
    it('handles input: ParameterKey=key,ParameterValue=value', function() {
      assert.deepEqual(opt_params('ParameterKey=key,ParameterValue=value'), {
        ParameterKey: 'key',
        ParameterValue: 'value'
      });
    });
    it('errors with input: ParameterKey=key,Unexpected=value', function() {
      assert.throws(function() {
        opt_params('ParameterKey=key,Unexpected=value');
      }, Error);
    });
    it('handles input: ParameterKey=subnet,ParameterValue=\\"subnet1,subnet2,subnet3\\"', function() {
      assert.deepEqual(opt_params('ParameterKey=subnet,ParameterValue=\"subnet1,subnet2,subnet3\"'), {
        ParameterKey: 'subnet',
        ParameterValue: 'subnet1,subnet2,subnet3'
      });
    });
    it('handles input: ParameterKey=subnet,ParameterValue="subnet1,subnet2,subnet3"', function() {
      assert.deepEqual(opt_params('ParameterKey=subnet,ParameterValue="subnet1,subnet2,subnet3"'), {
        ParameterKey: 'subnet',
        ParameterValue: 'subnet1,subnet2,subnet3'
      });
    });
    it('errors with input: ParameterKey=subnet,ParameterValue=subnet1,subnet2,subnet3', function() {
      assert.throws(function() {
        opt_params('ParameterKey=subnet,ParameterValue=subnet1,subnet2,subnet3')
      }, Error);
    });
    it('handles input: ParameterKey=vpc,ParameterValue=\\"vpcid=12345,vpceid=12345\\"', function() {
      assert.deepEqual(opt_params('ParameterKey=vpc,ParameterValue="vpcid=12345,vpceid=12345"'), {
        ParameterKey: 'vpc',
        ParameterValue: 'vpcid=12345,vpceid=12345'
      });
    });
    it('handles input: ParameterKey=vpc,ParameterValue=\"vpcid=12345,vpceid=12345\"', function() {
      assert.deepEqual(opt_params('ParameterKey=vpc,ParameterValue=\"vpcid=12345,vpceid=12345\"'), {
        ParameterKey: 'vpc',
        ParameterValue: 'vpcid=12345,vpceid=12345'
      });
    });
    it('errors with input: ParameterKey=vpc,ParameterValue=vpcid=12345,vpceid=12345', function() {
      assert.throws(function() {
        opt_params('ParameterKey=vpc,ParameterValue=vpcid=12345,vpceid=12345')
      }, Error);
    });
  });
  describe('tag', function() {
    it('handles input: Key=key,Value=value', function() {
      assert.deepEqual(opt_tag('Key=key,Value=value'), {
        Key: 'key',
        Value: 'value'
      });
    });
    it('handles input: Key=key,Value=\"values,value=1,value=2\"', function() {
      assert.deepEqual(opt_tag('Key=key,Value=\"values,value=1,value=2\"'), {
        Key: 'key',
        Value: 'values,value=1,value=2'
      });
    });
    it('handles input: Key=key,Value=\\"values,value=1,value=2\\"', function() {
      assert.deepEqual(opt_tag('Key=key,Value="values,value=1,value=2"'), {
        Key: 'key',
        Value: 'values,value=1,value=2'
      });
    });
    it('handles input: Key=s3bucket,Value=s3://bucket_name/....', function() {
      assert.deepEqual(opt_tag('Key=s3bucket,Value=s3://bucket_name/....'), {
        Key: 's3bucket',
        Value: 's3://bucket_name/....'
      });
    });
    it('handles input: Key=s3bucket,Value=\"S3link=s3://bucket_name/....,S3name=bucket_name\"', function() {
      assert.deepEqual(opt_tag('Key=s3bucket,Value=\"S3link=s3://bucket_name/....,S3name=bucket_name\"'), {
        Key: 's3bucket',
        Value: 'S3link=s3://bucket_name/....,S3name=bucket_name'
      });
    });
    it('errors with input: Key=s3buckets,Value=s3://bucket_name1/....,s3://bucket_name2/....', function() {
      assert.throws(function() {
        opt_tag('Key=s3buckets,Value=s3://bucket_name1/....,s3://bucket_name2/....')
      }, Error);
    });
    it('handles input: Key=s3buckets,Value=\"s3://bucket_name1/....,s3://bucket_name2/....\"', function() {
      assert.deepEqual(opt_tag('Key=s3buckets,Value=\"s3://bucket_name1/....,s3://bucket_name2/....\"'), {
        Key: 's3buckets',
        Value: 's3://bucket_name1/....,s3://bucket_name2/....'
      });
    });
    it('errors with input: Key=key,Value=values,value=1,value=2', function() {
      assert.throws(function() {
        opt_tag('Key=key,Value=values,value=1,value=2')
      }, Error);
    });
    it('errors with input: Key=key,Unexpected=value', function() {
      assert.throws(function() {
        opt_tag('Key=key,Unexpected=value');
      }, Error);
    });
  });
  describe('string', function() {
    it('handles valid string', function() {
      assert.deepEqual(opt_string('value'), 'value');
    });
    it('errors with zero length string', function() {
      assert.throws(function() {
        opt_string('')
      }, Error);
    });
  });
});