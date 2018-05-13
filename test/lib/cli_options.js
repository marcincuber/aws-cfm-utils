'use strict';

const assert = require('assert');
const { cliopts } = require('../../lib/cli_options.js');


describe('arg', () => {
  describe('parse', () => {
    it('required minimum', () => {
      const argv = cliopts(['/node', 'index.js', '--stack-name', 'name']);
      assert.equal(argv.stackName, 'name');
    });
    it('global', () => {
      const argv = cliopts(['/node', 'index.js', '--region', 'eu-west-1', '--profile', 'profile', '--stack-name', 'name']);
      assert.equal(argv.region, 'eu-west-1');
      assert.equal(argv.profile, 'profile');
      assert.equal(argv['stack-name'], 'name');
    });
    it('common', () => {
      const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--template-url', 'url', '--parameters', 'ParameterKey=key,UsePreviousValue=true', 'ParameterKey=key,ParameterValue=value', '--capabilities', 'CAPABILITY_NAMED_IAM', 'CAPABILITY_IAM', '--stack-events', '--resource-types', 'type1', 'type2', '--role-arn', 'arn', '--stack-policy-url', 'url', '--notification-arns', 'arn1', 'arn2']);
      assert.equal(argv['stack-name'], 'name');
      assert.equal(argv['template-url'], 'url');
      assert.deepEqual(argv.parameters, ['ParameterKey=key,UsePreviousValue=true', 'ParameterKey=key,ParameterValue=value']);
      assert.deepEqual(argv.capabilities, ['CAPABILITY_NAMED_IAM', 'CAPABILITY_IAM']);
      assert.deepEqual(argv['resource-types'], ['type1', 'type2']);
      assert.equal(argv['role-arn'], 'arn');
      assert.equal(argv['stack-policy-url'], 'url');
      assert.deepEqual(argv['notification-arns'], ['arn1', 'arn2']);
      assert.equal(argv['stack-events'], true);
    });
    describe('create', () => {
      it('create', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--timeout-in-minutes', '10', '--on-failure', 'DO_NOTHING', '--enable-termination-protection']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], undefined);
        assert.equal(argv['timeout-in-minutes'], 10);
        assert.equal(argv['on-failure'], 'DO_NOTHING');
        assert.equal(argv['enable-termination-protection'], true);
      });
      it('--enable-termination-protection', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--enable-termination-protection']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['enable-termination-protection'], true);
      });
      it('--no-enable-termination-protection', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--no-enable-termination-protection']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['enable-termination-protection'], false);
      });
      it('--disable-rollback', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--disable-rollback']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], true);
      });
      it('--no-disable-rollback', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--no-disable-rollback']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['disable-rollback'], false);
      });
    });
    describe('update', () => {
      it('update', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--stack-policy-during-update-body', 'body', '--stack-policy-during-update-url', 'url']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], undefined);
        assert.equal(argv['stack-policy-during-update-body'], 'body');
        assert.equal(argv['stack-policy-during-update-url'], 'url');
        assert.equal(argv['stack-events'], undefined);
      });
      it('--use-previous-template', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--use-previous-template']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], true);
      });
      it('--no-use-previous-template', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--no-use-previous-template']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv['use-previous-template'], false);
      });
    });
    describe('additional', () => {
      it('update', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv.wait, undefined);
      });
      it('--use-previous-template', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--wait']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv.wait, true);
      });
      it('--no-use-previous-template', () => {
        const argv = cliopts(['/node', 'index.js', '--stack-name', 'name', '--no-wait']);
        assert.equal(argv['stack-name'], 'name');
        assert.equal(argv.wait, false);
      });
    });
  });
});