import { run } from '@ember/runloop';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Component | risk tag', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // register t helper
    this.owner.register('helper:t', tHelper);
  });

  test('tapping button fires an external action', function(assert) {

    var component = this.owner.factoryFor('component:risk-tag').create();

    run(function() {
      assert.equal(component.get("scanningText"), "", "Scanning Text");
      component.set("analysis", {vulnerability: {types: [1]}});
      assert.equal(component.get("scanningText").string, "Scanning", "Scanning Text");
      component.set("analysis", {
        vulnerability: {
          types: [2]
        },
        file: {
          dynamicStatus: 0
        }
      });
      assert.equal(component.get("scanningText").string, "Untested", "Scanning Text");
      component.set("analysis", {
        vulnerability: {
          types: [2]
        }
      });
      assert.equal(component.get("scanningText").string, "Scanning", "Scanning Text");
      component.set("analysis", {
        vulnerability: {
          types: [3]
        }
      });
      assert.equal(component.get("scanningText").string, "Untested", "Scanning Text");
      component.set("analysis", {
        vulnerability: {
          types: [3]
        },
        file: {
          manual: true
        }
      });
      assert.equal(component.get("scanningText").string, "Requested", "Scanning Text");
      component.set("analysis", {
        vulnerability: {
          types: [4]
        }
      });
      assert.equal(component.get("scanningText").string, "Untested", "Scanning Text");
      component.set("analysis", {
        vulnerability: {
          types: [4]
        },
        file: {
          apiScanProgress: 1
        }
      });
      assert.equal(component.get("scanningText").string, "Scanning", "Scanning Text");
    });
  });
});
