import { run } from '@ember/runloop';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Component | file details', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // register t helper
    this.owner.register('helper:t', tHelper);
  });

  test('tapping button fires an external action', function(assert) {
    var component = this.owner.factoryFor('component:file-details').create();
    this.render();
    run(function() {
      component.set("file",
        {
          sortedAnalyses: [
            {
              id: 1,
              hasType: false
            },
            {
              id: 2,
              hasType: false
            },
            {
              id: 3,
              hasType: false
            }
          ]
        });
      assert.deepEqual(component.get("analyses"), [{"hasType": false,"id": 1},{"hasType": false,"id": 2},{"hasType": false,"id": 3}] , "Analyses");

      component.set("file",
        {
          sortedAnalyses: [
            {
              id: 1,
              hasType() {
                return true;
              }
            },
            {
              id: 2,
              hasType() {
                return true;
              }
            },
            {
              id: 3,
              hasType() {
                return true;
              }
            }
          ]
        });
      component.send("filterVulnerabilityType");
    });
  });
});
