'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { processopts } = require('../../lib/process_cli_options.js');

before(() => {
  sinon.stub(console, 'error').callsFake((warning) => { throw new Error(warning) })
});
after(() => console.error.restore());

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
      it('handles as empty array', () => {
        assert.throws(() => {
          processopts({
            tags: []
          });
        }, Error);
      });
      it('handles missing value inside array', () => {
        assert.throws(() => {
          processopts({
            tags: [
            '[{"Key": "TestTag1","Value":"TestTagValue1"}, {"Key"}]'
            ]
          });
        }, Error);
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
    describe('stackName', () => {
      it('handles as args', () => {
        const argv = processopts({
          'stack-name': 'name'
        });
        assert.deepEqual(argv.stackName, 'name');
      });
      it('error with empty stack-name', () => {
        assert.throws(() => {
          processopts({
            'stack-name': ''
          });
        }, Error);
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
      it('handles as empty array', () => {
        assert.throws(() => {
          processopts({
            'notification-arns': []
          });
        }, Error);
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
      it('handles as negative int', () => {
        assert.throws(() => {
          processopts({
            'timeout-in-minutes': -1,
            'stack-name': 'name'
          });
        }, Error);
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
    describe('accesskeyid', () => {
      it('handles as args', () => {
        const argv = processopts({
          'accesskeyid': '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.accesskeyid, '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas');
      });
      it('handles escaped quotes as args', () => {
        const argv = processopts({
          'accesskeyid': '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.accesskeyid, '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"');
      });
    });
    describe('secretkey', () => {
      it('handles as args', () => {
        const argv = processopts({
          'secretkey': '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.secretkey, '/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas');
      });
      it('handles escaped quotes as args', () => {
        const argv = processopts({
          'secretkey': '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"',
          'stack-name': 'name'
        });
        assert.deepEqual(argv.secretkey, '\"/+-sadasd213123,123as=dPOhrP9+4xW8z7v3hdas\"');
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
    describe('template-body', () => {
      it('handles as JSON file', () => {
        const argv = processopts({
          'template-body': [
            '../../../test/fixtures/short-template-body.json'
          ]
        });
        assert.deepEqual(argv.templateBody, '{\n  \"AWSTemplateFormatVersion\": \"2010-09-09\",\n  \"Parameters\": {\n    \"KeyName\": {\n      \"Default\": \"TNLDefault\"\n    },\n    \"TestName\": {\n      \"Description\": \"TestName\",\n      \"Type\": \"String\"\n    },\n    \"TestName2\":{\n      \"Description\": \"TestName2\",\n      \"Type\": \"String\"\n    }\n  },\n  \"Mappings\": {\n    \"AWSNATAMI\": {\n      \"eu-west-1\": { \"AMI\": \"ami-785db401\" }\n    },\n    \"AWSRegionArch2AMI\": {\n      \"eu-west-1\": { \"64\": \"ami-785db401\" }\n    }\n  }\n}\n'
        );
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
    describe('stack-policy-during-update-body', () => {
      it('handles as JSON file', () => {
        const argv = processopts({
          'stack-policy-during-update-body': [
            '../../../test/fixtures/stackpolicy.json'
          ]
        });
        assert.deepEqual(argv.stackPolicyDuringUpdateBody, '{\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"Update:*\",\n      \"Principal\": \"*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}\n'
        );
      });
    });
    describe('stack-policy-body', () => {
      it('handles as JSON file', () => {
        const argv = processopts({
          'stack-policy-body': [
            '../../../test/fixtures/stackpolicy.json'
          ]
        });
        assert.deepEqual(argv.stackPolicyBody, '{\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"Update:*\",\n      \"Principal\": \"*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}\n'
        );
      });
    });
  });
});