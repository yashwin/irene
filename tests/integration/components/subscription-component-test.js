import { run } from '@ember/runloop';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | subscription component', function(hooks) {
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

    var component = this.owner.factoryFor('component:subscription-component').create();
    run(function() {
      component.send('openCancelSubscriptionConfirmBox');
      assert.equal(component.get('showCancelSubscriptionConfirmBox'),true, "Open Modal");
      component.send('closeCancelSubscriptionConfirmBox');
      assert.equal(component.get('showCancelSubscriptionConfirmBox'),false, "Close Modal");

      component.set("subscription", {id: 1});
      assert.equal(component.confirmCallback(), undefined, "Confirm Callback");

    });
  });
});
