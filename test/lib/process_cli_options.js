'use strict';

const assert = require('assert');
const { processopts } = require('../../lib/process_cli_options.js');

describe('processopts', function() {
  describe('proccess cli options', function() {
    describe('parameters', function() {
      it('handles as args', function() {
        const argv = processopts({
          parameters: [
            'ParameterKey=key,UsePreviousValue=true',
            'ParameterKey=key,ParameterValue=value'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.parameters, [
          { ParameterKey: 'key', UsePreviousValue: true },
          { ParameterKey: 'key', ParameterValue: 'value' }
        ]);
      });
      it('handles as JSON file', function() {
        const argv = processopts({
          parameters: [
            '../../../test/fixtures/parameters.json'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.parameters, [
          { ParameterKey: 'TestName', ParameterValue: 'TestNameValue' },
          { ParameterKey: 'TestName2', ParameterValue: 'TestNameValue2' }
        ]);
      });
      it('handles as JSON string', function() {
        const argv = processopts({
          parameters: [
            '[{"ParameterKey": "KeyVal1","ParameterValue":"sVal1"}, {"ParameterKey": "KeyVal2","ParameterValue":"sVal2"}]'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.parameters, [
          { ParameterKey: 'KeyVal1', ParameterValue: 'sVal1' },
          { ParameterKey: 'KeyVal2', ParameterValue: 'sVal2' }
        ]);
      });
    });
    describe('tags', function() {
      it('handles as args', function() {
        const argv = processopts({
          tags: [
            'Key=TestTag1,Value=TestTagValue1',
            'Key=TestTag2,Value=TestTagValue2'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.tags, [
          { Key: 'TestTag1', Value: 'TestTagValue1' },
          { Key: 'TestTag2', Value: 'TestTagValue2' }
        ]);
      });
      it('handles as JSON file', function() {
        const argv = processopts({
          tags: [
            '../../../test/fixtures/tags.json'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.tags, [
          { Key: 'TestTag1', Value: 'TestTagValue1' },
          { Key: 'TestTag2', Value: 'TestTagValue2' }
        ]);
      });
      it('handles as JSON string', function() {
        const argv = processopts({
          tags: [
            '[{"Key": "TestTag1","Value":"TestTagValue1"}, {"Key": "TestTag2","Value":"TestTagValue2"}]'
          ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.tags, [
          { Key: 'TestTag1', Value: 'TestTagValue1' },
          { Key: 'TestTag2', Value: 'TestTagValue2' }
        ]);
      });
    });
    describe('capabilities', function() {
      it('handles as args', function() {
        const argv = processopts({
          'capabilities': [ true ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.capabilities, [ true ] );
      });
    });
    describe('enableTerminationProtection', function() {
      it('handles as args', function() {
        const argv = processopts({
          'enable-termination-protection': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.enableTerminationProtection, true);
      });
    });
    describe('stackPolicyUrl', function() {
      it('handles as args', function() {
        const argv = processopts({
          'stack-policy-url': 'https://bucket.s3-eu-west-1.amazonaws.com',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackPolicyUrl, 'https://bucket.s3-eu-west-1.amazonaws.com');
      });
    });
    describe('templateUrl', function() {
      it('handles as args', function() {
        const argv = processopts({
          'template-url': 'https://bucket.s3-eu-west-1.amazonaws.com',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.templateUrl, 'https://bucket.s3-eu-west-1.amazonaws.com');
      });
    });
    describe('notificationArns', function() {
      it('handles as args', function() {
        const argv = processopts({
          'notification-arns': [ 'arn:aws:sns:eu-west-1:123456789012:example-topic' ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.notificationArns, [ 'arn:aws:sns:eu-west-1:123456789012:example-topic' ]);
      });
    });
    describe('resourceTypes', function() {
      it('handles as args', function() {
        const argv = processopts({
          'resource-types': [ 'AWS::EC2::Instance', 'AWS::EC2::Resource' ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.resourceTypes, [ 'AWS::EC2::Instance', 'AWS::EC2::Resource' ]);
      });
    });
    describe('timeoutInMinutes', function() {
      it('handles as positive int', function() {
        const argv = processopts({
          'timeout-in-minutes': 1,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.timeoutInMinutes, 1);
      });
    });
  });
});