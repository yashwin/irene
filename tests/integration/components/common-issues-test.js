import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';


module('Integration | Component | common issues', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', function(assert) {
    assert.ok(true);
    assert.dom('*').hasText('');
  });
});
