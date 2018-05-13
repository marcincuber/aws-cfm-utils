'use strict';

const assert = require('assert');
const { processopts } = require('../../lib/process_cli_options.js');

describe('processopts', () => {
  describe('proccess cli options', () => {
    describe('parameters', () => {
      it('handles as args', () => {
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
      it('handles as JSON file', () => {
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
      it('handles as JSON string', () => {
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
    describe('tags', () => {
      it('handles as args', () => {
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
      it('handles as JSON file', () => {
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
      it('handles as JSON string', () => {
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
    describe('capabilities', () => {
      it('handles as args', () => {
        const argv = processopts({
          'capabilities': [ true ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.capabilities, [ true ] );
      });
    });
    describe('enableTerminationProtection', () => {
      it('handles as args', () => {
        const argv = processopts({
          'enable-termination-protection': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.enableTerminationProtection, true);
      });
      it('handles as empty args', () => {
        const argv = processopts({
          'enable-termination-protection': '',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.enableTerminationProtection, false);
      });
    });
    describe('disableRollback', () => {
      it('handles as args', () => {
        const argv = processopts({
          'disable-rollback': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.disableRollback, true);
      });
    });
    describe('stackPolicyUrl', () => {
      it('handles as args', () => {
        const argv = processopts({
          'stack-policy-url': 'https://bucket.s3-eu-west-1.amazonaws.com',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackPolicyUrl, 'https://bucket.s3-eu-west-1.amazonaws.com');
      });
    });
    describe('templateUrl', () => {
      it('handles as args', () => {
        const argv = processopts({
          'template-url': 'https://bucket.s3-eu-west-1.amazonaws.com',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.templateUrl, 'https://bucket.s3-eu-west-1.amazonaws.com');
      });
    });
    describe('notificationArns', () => {
      it('handles as args', () => {
        const argv = processopts({
          'notification-arns': [ 'arn:aws:sns:eu-west-1:123456789012:example-topic' ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.notificationArns, [ 'arn:aws:sns:eu-west-1:123456789012:example-topic' ]);
      });
    });
    describe('roleArn', () => {
      it('handles as args', () => {
        const argv = processopts({
          'role-arn': 'arn:aws:sns:eu-west-1:123456789012:example-topic',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.roleArn, 'arn:aws:sns:eu-west-1:123456789012:example-topic');
      });
    });
    describe('resourceTypes', () => {
      it('handles as args', () => {
        const argv = processopts({
          'resource-types': [ 'AWS::EC2::Instance', 'AWS::EC2::Resource' ],
          'stack-name': 'name'
        });
        assert.deepEqual(argv.resourceTypes, [ 'AWS::EC2::Instance', 'AWS::EC2::Resource' ]);
      });
    });
    describe('timeoutInMinutes', () => {
      it('handles as positive int', () => {
        const argv = processopts({
          'timeout-in-minutes': 1,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.timeoutInMinutes, 1);
      });
    });
    describe('onFailure', () => {
      it('handles as args', () => {
        const argv = processopts({
          'on-failure': 'DO_NOTHING',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.onFailure, 'DO_NOTHING');
      });
    });
    describe('UsePreviousTemplate', () => {
      it('handles as args', () => {
        const argv = processopts({
          'use-previous-template': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.UsePreviousTemplate, true);
      });
    });
    describe('stackPolicyDuringUpdateUrl', () => {
      it('handles as args', () => {
        const argv = processopts({
          'stack-policy-during-update-url': 'https://bucket.s3-eu-west-1.amazonaws.com',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackPolicyDuringUpdateUrl, 'https://bucket.s3-eu-west-1.amazonaws.com');
      });
    });
    describe('profile', () => {
      it('handles as args', () => {
        const argv = processopts({
          'profile': 'webuser',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.profile, 'webuser');
      });
    });
    describe('region', () => {
      it('handles as args', () => {
        const argv = processopts({
          'region': 'eu-west-1',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.region, 'eu-west-1');
      });
    });
    describe('wait', () => {
      it('handles as args', () => {
        const argv = processopts({
          'wait': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.wait, true);
      });
      it('handles as empty', () => {
        const argv = processopts({
          'wait': '',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.wait, false);
      });
    });
    describe('stack-events', () => {
      it('handles as args', () => {
        const argv = processopts({
          'stack-events': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackEvents, true);
      });
      it('handles as empty', () => {
        const argv = processopts({
          'stack-events': '',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackEvents, false);
      });
    });
  });
});