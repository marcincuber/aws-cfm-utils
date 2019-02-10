'use strict';

const assert = require('assert');
const sinon = require('sinon');
const { cliopts } = require('../../lib/cli_options.js');

describe('arg', function() {
  describe('parse', function() {
    it('required minimum', function() {
      const argv = cliopts(['/node', 'index.js', '--stack-name', 'name']);
      assert.equal(argv['stackName'], 'name');
    });
    it('global', function() {
      const argv = cliopts(['/node', 'index.js', '--region', 'eu-west-2', '--profile', 'profile', '--stack-name', 'name']);
      assert.equal(argv['region'], 'eu-west-2');
      assert.equal(argv['profile'], 'profile');
      assert.equal(argv['stack-name'], 'name');
    });
    it('common', function() {
      const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--template-url', 'url', '--parameters', 'ParameterKey=key,UsePreviousValue=true', 'ParameterKey=key,ParameterValue=value', '--capabilities', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_IAM', 'CAPABILITY_AUTO_EXPAND', '--stack-events', '--resource-types', 'type1', 'type2', '--role-arn', 'arn', '--stack-policy-url', 'url', '--notification-arns', 'arn1', 'arn2']);
      assert.equal(argv['stack-name'], 'name');
      assert.equal(argv['template-url'], 'url');
      assert.deepEqual(argv['parameters'], ['ParameterKey=key,UsePreviousValue=true', 'ParameterKey=key,ParameterValue=value']);
      assert.deepEqual(argv['capabilities'], ['CAPABILITY_NAMED_IAM', 'CAPABILITY_IAM', 'CAPABILITY_AUTO_EXPAND']);
      assert.deepEqual(argv['resource-types'], ['type1', 'type2']);
      assert.equal(argv['role-arn'], 'arn');
      assert.equal(argv['stack-policy-url'], 'url');
      assert.deepEqual(argv['notification-arns'], ['arn1', 'arn2']);
      assert.equal(argv['stack-events'], true);
    });
    describe('create', function() {
      it('create', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--timeout-in-minutes', '10', '--on-failure', 'DO_NOTHING', '--enable-termination-protection']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], undefined);
        assert.equal(argv['timeout-in-minutes'], 10);
        assert.equal(argv['on-failure'], 'DO_NOTHING');
        assert.equal(argv['enable-termination-protection'], true);
      });
      it('--enable-termination-protection', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--enable-termination-protection']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['enable-termination-protection'], true);
      });
      it('--no-enable-termination-protection', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--no-enable-termination-protection']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['enable-termination-protection'], false);
      });
      it('--disable-rollback', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--disable-rollback']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], true);
      });
      it('--no-disable-rollback', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--no-disable-rollback']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], false);
      });
    });
    describe('update', function() {
      it('update', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--stack-policy-during-update-body', 'body', '--stack-policy-during-update-url', 'url']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], undefined);
        assert.equal(argv['stack-policy-during-update-body'], 'body');
        assert.equal(argv['stack-policy-during-update-url'], 'url');
        assert.equal(argv['stack-events'], undefined);
      });
      it('--use-previous-template', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--use-previous-template']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], true);
      });
      it('--no-use-previous-template', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--no-use-previous-template']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], false);
      });
    });
    describe('additional', function() {
      it('takes --stack-events', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--stack-events']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['stack-events'], true);
      });
      it('does not take --stack-events', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['stack-events'], undefined);
      });
      it('takes --refresh-rate', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--refresh-rate', '50']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['refresh-rate'], 50);
      });
      it('does not take --refresh-rate', function() {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['refresh-rate'], 15);
      });
    });
  });
  describe('other', function() {
    before(function() {
      sinon.stub(console, 'error').callsFake(function(warning) { throw new Error(warning) })
    });
    after(function() { console.error.restore() });

    describe('credentials', function() {
      it('takes profile and no region', function() {
        const argv = cliopts(['/node', 'index.js', '--profile', 'yourprofilname', '--stack-name', 'name']);
          assert.equal(argv['region'], 'eu-west-1');
          assert.equal(argv['profile'], 'yourprofilname');
          assert.equal(argv['stack-name'], 'name');
      });
      it('takes AWS keys credentials', function() {
        const argv = cliopts(['/node', 'index.js', '--accesskeyid', 'AWS_KEY_ID', '--secretkey', 'AWS_SECRET_KEY', '--stack-name', 'name']);
          assert.equal(argv['region'], 'eu-west-1');
          assert.equal(argv['stack-name'], 'name');
          assert.equal(argv['accesskeyid'], 'AWS_KEY_ID');
          assert.equal(argv['secretkey'], 'AWS_SECRET_KEY');
      });
      it('takes AWS keys credentials and sessiontoken', function() {
        const argv = cliopts(['/node', 'index.js', '--accesskeyid', 'AWS_KEY_ID', '--secretkey', 'AWS_SECRET_KEY', '--stack-name', 'name', '--sessiontoken', 'random_£$%!2341STR']);
          assert.equal(argv['region'], 'eu-west-1');
          assert.equal(argv['stack-name'], 'name');
          assert.equal(argv['accesskeyid'], 'AWS_KEY_ID');
          assert.equal(argv['secretkey'], 'AWS_SECRET_KEY');
          assert.equal(argv['sessiontoken'], 'random_£$%!2341STR');
      });
      it('errors when accesskeyid is passed without secretkey', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--accesskeyid', 'AWS_KEY_ID']);
        }, Error);
      });
      it('errors when secretkey is passed without accesskeyid', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--secretkey', 'AWS_SECRET_KEY']);
        }, Error);
      });
      it('errors when sessiontoken is passed without accesskeyid and secretkey', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--sessiontoken', 'random_£$%!2341STR']);
        }, Error);
      });
      it('errors when sessiontoken is passed without secretkey', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--secretkey', 'AWS_SECRET_KEY', '--sessiontoken', 'random_£$%!2341STR']);
        }, Error);
      });
      it('errors when sessiontoken is passed without accesskeyid', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--accesskeyid', 'AWS_KEY_ID', '--sessiontoken', 'random_£$%!2341STR']);
        }, Error);
      });
    });
    describe('conflicting values', function() {
      it('errors when profile and AWS access keys are passed', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--profile', 'yourprofilname', '--accesskeyid', 'AWS_KEY_ID', '--secretkey', 'AWS_SECRET_KEY']);
        }, Error);
      });
      it('errors when profile and AWS access keys are passed with sessiontoken', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--profile', 'yourprofilname', '--accesskeyid', 'AWS_KEY_ID', '--secretkey', 'AWS_SECRET_KEY', '--sessiontoken', 'random_£$%!2341STR']);
        }, Error);
      });
      it('errors when profile and sessiontoken is passed in without AWS access keys', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--profile', 'yourprofilname', '--sessiontoken', 'random_£$%!2341STR']);
        }, Error);
      });
      it('errors when template-url and template-body are passed', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--template-url', 'url', '--template-body', 'body']);
        }, Error);
      });
      it('errors when template-url and template-body are passed', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js', '--stack-name', 'name', '--stack-policy-body', 'policy-body', '--stack-policy-url', 'policy-url']);
        }, Error);
      });
      it('errors when no arguments are passed', function() {
        assert.throws(function() {
          cliopts(['/node', 'index.js']);
        }, Error);
      });
    });
  });
});