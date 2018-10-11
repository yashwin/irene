import { run } from '@ember/runloop';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | auth mfa', function(hooks) {
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
    var component = this.owner.factoryFor('component:auth-mfa').create();
    this.render();

    run(function() {

      component.send('openMFAEnableModal');
      component.send('openMFADisableModal');
      component.send('closeMFAEnableModal');
      component.send('closeMFADisableModal');
      component.send('showBarCode');

      assert.equal(component.get("showMFAIntro"), false, 'MFA Into');
      component.set("user", {provisioningURL: "https://"});
      assert.ok(component.didInsertElement());

      assert.equal(component.get("showBarCode"), true, 'Barcode');

      component.set("enableMFAOTP", "123456");
      component.send('enableMFA');
      component.set("enableMFAOTP", "12345");
      component.send('enableMFA');

      component.set("disableMFAOTP", "123456");
      component.send('disableMFA');
      component.set("disableMFAOTP", "12345");
      component.send('disableMFA');

    });
  });
});
