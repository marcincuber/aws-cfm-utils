'use strict';

const assert = require('assert');
const { opt_params, opt_string, opt_tag } = require('../../lib/convert.js');

describe('convert', () => {
  describe('parameter', () => {
    it('ParameterKey=key,UsePreviousValue=true', () => {
      assert.deepEqual(opt_params('ParameterKey=key,UsePreviousValue=true'), {
        ParameterKey: 'key',
        UsePreviousValue: true
      });
    });
    it('ParameterKey=key,UsePreviousValue=false', () => {
      assert.deepEqual(opt_params('ParameterKey=key,UsePreviousValue=false'), {
        ParameterKey: 'key',
        UsePreviousValue: false
      });
    });
    it('ParameterKey=key,ParameterValue=value', () => {
      assert.deepEqual(opt_params('ParameterKey=key,ParameterValue=value'), {
        ParameterKey: 'key',
        ParameterValue: 'value'
      });
    });
    it('ParameterKey=key,Unexpected=value', () => {
      assert.throws(() => {
        opt_params('ParameterKey=key,Unexpected=value');
      }, Error);
    });
    it('ParameterKey=subnet,ParameterValue=\\"subnet1,subnet2,subnet3\\"', () => {
      assert.deepEqual(opt_params('ParameterKey=subnet,ParameterValue=\"subnet1,subnet2,subnet3\"'), {
        ParameterKey: 'subnet',
        ParameterValue: 'subnet1,subnet2,subnet3'
      });
    });
    it('ParameterKey=subnet,ParameterValue="subnet1,subnet2,subnet3"', () => {
      assert.deepEqual(opt_params('ParameterKey=subnet,ParameterValue="subnet1,subnet2,subnet3"'), {
        ParameterKey: 'subnet',
        ParameterValue: 'subnet1,subnet2,subnet3'
      });
    });
    it('Errors ParameterKey=subnet,ParameterValue=subnet1,subnet2,subnet3', () => {
      assert.throws(() => {
        opt_params('ParameterKey=subnet,ParameterValue=subnet1,subnet2,subnet3')
      }, Error);
    });
    it('ParameterKey=vpc,ParameterValue=\\"vpcid=12345,vpceid=12345\\"', () => {
      assert.deepEqual(opt_params('ParameterKey=vpc,ParameterValue="vpcid=12345,vpceid=12345"'), {
        ParameterKey: 'vpc',
        ParameterValue: 'vpcid=12345,vpceid=12345'
      });
    });
    it('ParameterKey=vpc,ParameterValue=\"vpcid=12345,vpceid=12345\"', () => {
      assert.deepEqual(opt_params('ParameterKey=vpc,ParameterValue=\"vpcid=12345,vpceid=12345\"'), {
        ParameterKey: 'vpc',
        ParameterValue: 'vpcid=12345,vpceid=12345'
      });
    });
    it('Errors ParameterKey=vpc,ParameterValue=vpcid=12345,vpceid=12345', () => {
      assert.throws(() => {
        opt_params('ParameterKey=vpc,ParameterValue=vpcid=12345,vpceid=12345')
      }, Error);
    });
  });
  describe('tag', () => {
    it('Key=key,Value=value', () => {
      assert.deepEqual(opt_tag('Key=key,Value=value'), {
        Key: 'key',
        Value: 'value'
      });
    });
    it('Key=key,Value=\"values,value=1,value=2\"', () => {
      assert.deepEqual(opt_tag('Key=key,Value=\"values,value=1,value=2\"'), {
        Key: 'key',
        Value: 'values,value=1,value=2'
      });
    });
    it('Key=key,Value=\\"values,value=1,value=2\\"', () => {
      assert.deepEqual(opt_tag('Key=key,Value="values,value=1,value=2"'), {
        Key: 'key',
        Value: 'values,value=1,value=2'
      });
    });
    it('Key=s3bucket,Value=s3://bucket_name/....', () => {
      assert.deepEqual(opt_tag('Key=s3bucket,Value=s3://bucket_name/....'), {
        Key: 's3bucket',
        Value: 's3://bucket_name/....'
      });
    });
    it('Key=s3bucket,Value=\"S3link=s3://bucket_name/....,S3name=bucket_name\"', () => {
      assert.deepEqual(opt_tag('Key=s3bucket,Value=\"S3link=s3://bucket_name/....,S3name=bucket_name\"'), {
        Key: 's3bucket',
        Value: 'S3link=s3://bucket_name/....,S3name=bucket_name'
      });
    });
    it('Key=s3buckets,Value=s3://bucket_name1/....,s3://bucket_name2/....', () => {
      assert.throws(() => {
        opt_tag('Key=s3buckets,Value=s3://bucket_name1/....,s3://bucket_name2/....')
      }, Error);
    });
    it('Key=s3buckets,Value=\"s3://bucket_name1/....,s3://bucket_name2/....\"', () => {
      assert.deepEqual(opt_tag('Key=s3buckets,Value=\"s3://bucket_name1/....,s3://bucket_name2/....\"'), {
        Key: 's3buckets',
        Value: 's3://bucket_name1/....,s3://bucket_name2/....'
      });
    });
    it('Errors Key=key,Value=values,value=1,value=2', () => {
      assert.throws(() => {
        opt_tag('Key=key,Value=values,value=1,value=2')
      }, Error);
    });
    it('Key=key,Unexpected=value', () => {
      assert.throws(() => {
        opt_tag('Key=key,Unexpected=value');
      }, Error);
    });
  });
  describe('String value', () => {
    it('value', () => {
      assert.deepEqual(opt_string('value'), 'value');
    });
    it('Empty string', () => {
      assert.throws(() => {
        opt_string();
      }, Error);
    });
  });
});