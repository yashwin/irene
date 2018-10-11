import { run } from '@ember/runloop';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | password change', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // register t helper
    this.owner.register('helper:t', tHelper);

    // start Mirage
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    // shutdown Mirage
    this.server.shutdown();
  });

  test('tapping button fires an external action', function(assert) {

    var component = this.owner.factoryFor('component:password-change').create();

    run(function() {
      component.send("changePassword");
      component.set("passwordCurrent", "testpassword");
      component.set("passwordNew", "testpassword");
      component.set("passwordConfirm", "testpassword1");
      component.send("changePassword");
      component.set("passwordConfirm", "testpassword");
      component.send("changePassword");
      assert.equal(component.get("isChangingPassword"), true, 'Changing Password');
    });
  });
});
