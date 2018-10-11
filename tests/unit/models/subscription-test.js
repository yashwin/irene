import { run } from '@ember/runloop';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | subscription', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);
  });

  test('it exists', function(assert) {
    const subscription = run(() => this.owner.lookup('service:store').createRecord('subscription'));
    run(function() {
      const d = new Date("25 March 2015");
      subscription.set('expiryDate', d);
      assert.equal(subscription.get('expiryDateOnHumanized'), d.toLocaleDateString(), "Expiry Date");

      subscription.set('isTrial', true);
      subscription.set('isCancelled', true);
      assert.equal(subscription.get('subscriptionText.string'), "Your trial will expire on", "Expiry Text");
      subscription.set('isCancelled', false);
      assert.equal(subscription.get('subscriptionText.string'), "You will be charged on", "Expiry Text");
      subscription.set('isTrial', false);
      subscription.set('isCancelled', true);
      assert.equal(subscription.get('subscriptionText.string'), "Your free trial will be converted into paid subscription on", "Expiry Text");
      subscription.set('isCancelled', false);
      assert.equal(subscription.get('subscriptionText.string'), "Subscription will expire on", "Expiry Text");
    });
  });
});
