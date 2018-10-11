import { run } from '@ember/runloop';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | attachment detail', function(hooks) {
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

  test('clicking download link fires an external action', function(assert) {
    var component = this.owner.factoryFor('component:attachment-detail').create();

    run(function() {
      component.set("attachment", {downloadUrl: '/api/attachments/20'});
      component.send('downloadAttachment');
      assert.equal(component.get('isDownloadingAttachment'),true);
    });
  });
});

