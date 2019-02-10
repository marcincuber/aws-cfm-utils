'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { processopts } = require('../../lib/process_cli_options.js');

describe('processopts', function() {
  before(function() {
    sinon.stub(console, 'error').callsFake(function(warning) { throw new Error(warning) })
  });
  after(function() { console.error.restore() });

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
            'file://test/fixtures/parameters.json'
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
            'file://test/fixtures/tags.json'
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
      it('handles as empty array', function() {
        assert.throws(function() {
          processopts({
            tags: []
          });
        }, Error);
      });
      it('handles missing value inside array', function() {
        assert.throws(function() {
          processopts({
            tags: [
            '[{"Key": "TestTag1","Value":"TestTagValue1"}, {"Key"}]'
            ]
          });
        }, Error);
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
      it('handles as empty args', function() {
        const argv = processopts({
          'enable-termination-protection': '',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.enableTerminationProtection, false);
      });
    });
    describe('disableRollback', function() {
      it('handles as args', function() {
        const argv = processopts({
          'disable-rollback': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.disableRollback, true);
      });
    });
    describe('stackName', function() {
      it('handles as args', function() {
        const argv = processopts({
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackName, 'name');
      });
      it('error with empty stack-name', function() {
        assert.throws(function() {
          processopts({
            'stack-name': ''
          });
        }, Error);
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
      it('handles as empty array', function() {
        assert.throws(function() {
          processopts({
            'notification-arns': []
          });
        }, Error);
      });
    });
    describe('roleArn', function() {
      it('handles as args', function() {
        const argv = processopts({
          'role-arn': 'arn:aws:sns:eu-west-1:123456789012:example-topic',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.roleArn, 'arn:aws:sns:eu-west-1:123456789012:example-topic');
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
      it('handles as negative int', function() {
        assert.throws(function() {
          processopts({
            'timeout-in-minutes': -1,
            'stack-name': 'name'
          });
        }, Error);
      });
    });
    describe('onFailure', function() {
      it('handles as args', function() {
        const argv = processopts({
          'on-failure': 'DO_NOTHING',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.onFailure, 'DO_NOTHING');
      });
    });
    describe('UsePreviousTemplate', function() {
      it('handles as args', function() {
        const argv = processopts({
          'use-previous-template': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.UsePreviousTemplate, true);
      });
    });
    describe('stackPolicyDuringUpdateUrl', function() {
      it('handles as args', function() {
        const argv = processopts({
          'stack-policy-during-update-url': 'https://bucket.s3-eu-west-1.amazonaws.com',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackPolicyDuringUpdateUrl, 'https://bucket.s3-eu-west-1.amazonaws.com');
      });
    });
    describe('profile', function() {
      it('handles as args', function() {
        const argv = processopts({
          'profile': 'webuser',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.profile, 'webuser');
      });
    });
    describe('accesskeyid', function() {
      it('handles as args', function() {
        const argv = processopts({
          'accesskeyid': '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.accesskeyid, '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas');
      });
      it('handles escaped quotes as args', function() {
        const argv = processopts({
          'accesskeyid': '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.accesskeyid, '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"');
      });
    });
    describe('secretkey', function() {
      it('handles as args', function() {
        const argv = processopts({
          'secretkey': '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.secretkey, '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas');
      });
      it('handles escaped quotes as args', function() {
        const argv = processopts({
          'secretkey': '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.secretkey, '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"');
      });
    });
    describe('sessiontoken', function() {
      it('handles as args', function() {
        const argv = processopts({
          'sessiontoken': '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.sessiontoken, '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas');
      });
      it('handles escaped quotes as args', function() {
        const argv = processopts({
          'sessiontoken': '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.sessiontoken, '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"');
      });
    });
    describe('region', function() {
      it('handles as args', function() {
        const argv = processopts({
          'region': 'eu-west-1',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.region, 'eu-west-1');
      });
    });
    describe('template-body', function() {
      it('handles as JSON file', function() {
        const argv = processopts({
          'template-body': 'file://test/fixtures/short-template-body.json'
        });
        assert.deepEqual(argv.templateBody, '{\n  \"AWSTemplateFormatVersion\": \"2010-09-09\",\n  \"Parameters\": {\n    \"KeyName\": {\n      \"Default\": \"test-key-pair\"\n    },\n    \"TestName\": {\n      \"Description\": \"TestName\",\n      \"Type\": \"String\"\n    },\n    \"TestName2\":{\n      \"Description\": \"TestName2\",\n      \"Type\": \"String\"\n    }\n  },\n  \"Mappings\": {\n    \"AWSNATAMI\": {\n      \"eu-west-1\": { \"AMI\": \"ami-785db401\" }\n    },\n    \"AWSRegionArch2AMI\": {\n      \"eu-west-1\": { \"64\": \"ami-785db401\" }\n    }\n  }\n}\n'
        );
      });
    });
    describe('stack-events', function() {
      it('handles as args', function() {
        const argv = processopts({
          'stack-events': true,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackEvents, true);
      });
      it('handles as empty', function() {
        const argv = processopts({
          'stack-events': '',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackEvents, false);
      });
    });
    describe('refreshRate', function() {
      it('handles as positive int', function() {
        const argv = processopts({
          'refresh-rate': 50,
          'stack-name': 'name'
        });
        assert.deepEqual(argv.refreshRate, 50);
      });
      it('handles as negative int', function() {
        assert.throws(function() {
          processopts({
            'refresh-rate': -1,
            'stack-name': 'name'
          });
        }, Error);
      });
    });
    describe('stack-policy-during-update-body', function() {
      it('handles as JSON file', function() {
        const argv = processopts({
          'stack-policy-during-update-body': 'file://test/fixtures/stackpolicy.json'
        });
        assert.deepEqual(argv.stackPolicyDuringUpdateBody, '{\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"Update:*\",\n      \"Principal\": \"*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}\n'
        );
      });
    });
    describe('stack-policy-body', function() {
      it('handles as JSON file', function() {
        const argv = processopts({
          'stack-policy-body': 'file://test/fixtures/stackpolicy.json'
        });
        assert.deepEqual(argv.stackPolicyBody, '{\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"Update:*\",\n      \"Principal\": \"*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}\n'
        );
      });
      it('handles as JSON string', function() {
        const argv = processopts({
          'stack-policy-body': '{\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"Update:*\",\n      \"Principal\": \"*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}\n'
        });
        assert.deepEqual(argv.stackPolicyBody, '{\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"Update:*\",\n      \"Principal\": \"*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}\n'
        );
      });
    });
  });
});