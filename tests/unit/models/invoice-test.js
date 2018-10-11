import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import localeConfig from 'ember-i18n/config/en';

module('Unit | Model | invoice', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);
  });

  test('it exists', function(assert) {
    const invoice = run(() => this.owner.lookup('service:store').createRecord('invoice'));
    run(function() {
      const d = new Date("25 March 2015");
      invoice.set('paidOn', d);
      assert.equal(invoice.get('paidOnHumanized'), d.toLocaleDateString(), "Paid On");

      assert.equal(invoice.get('paidDate'), "Pending", "Paid Date Pending");
      assert.equal(invoice.get('paidStatus.string'), "Unpaid", "Unpaid");
      invoice.set('isPaid', true);
      assert.equal(invoice.get('paidDate'), d.toLocaleDateString(), "Paid Date");
      assert.equal(invoice.get('paidStatus.string'), "Paid", "Paid");
    });

  });
});
