import { run } from '@ember/runloop';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | device preference', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);
  });

  test('it exists', function(assert) {
    const devicePreference = run(() => this.owner.lookup('service:store').createRecord('device-preference'));
    run(function() {
      devicePreference.set('platformVersion', "1");
      assert.equal(devicePreference.get('versionText'), "1", "Version Text");
      devicePreference.set('platformVersion', "0");
      assert.equal(devicePreference.get('versionText.string'), "Any Version", "Version Text");
    });
  });
});
