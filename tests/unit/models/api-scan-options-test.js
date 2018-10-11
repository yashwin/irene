import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | api scan options', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    const apiScanOptions = run(() => this.owner.lookup('service:store').createRecord('api-scan-options'));
    run(function() {
      apiScanOptions.set('apiUrlFilters', "test.com");
      assert.equal(apiScanOptions.get('apiUrlFilterItems'), "test.com", "No role");
    });
  });
});
