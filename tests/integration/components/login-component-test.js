import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Component | login component', function(hooks) {
  setupTest(hooks);

  test('tapping button fires an external action', function(assert) {
    var component = this.owner.factoryFor('component:login-component').create();
    component.send("authenticate");
    assert.equal(component.get("MFAEnabled"), false, 'MFA Enabled');
  });
});
