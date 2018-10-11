import { run } from '@ember/runloop';
import { Promise } from 'rsvp';
import ENUMS from 'irene/enums';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | dynamic scan', function(hooks) {
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

  test('it exists', function(assert) {
    const component = this.owner.factoryFor('component:dynamic-scan').create();

    this.render();
    run(function() {
      component.set("apiScanModal", true);
      component.send('goBack');
      component.set("dynamicScanModal", true);
      component.send('goBack');
      assert.equal(component.get("showAPIScanModal"), true, "API Scan Modal");
      assert.equal(component.get("showRunDynamicScanModal"), true, "Dynamic Scan Modal");
      component.send('closeModal');
      assert.equal(component.get("showAPIScanModal"), false, "API Scan Modal");
      assert.equal(component.get("showAPIURLFilterScanModal"), false, "API URL Modal");
      assert.equal(component.get("showRunDynamicScanModal"), false, "Dynamic Scan Modal");

      component.send('openRunDynamicScanModal');
      assert.equal(component.get("showRunDynamicScanModal"), true, "Close Dynamic Scan Modal");
      component.send('closeRunDynamicScanModal');
      assert.equal(component.get("showRunDynamicScanModal"), false, "Open Dynamic Scan Modal");

      component.set("file", {
        id:1,
        setBootingStatus() {
          return true;
        },
        setShuttingDown() {
          return true;
        },
        dynamicStatus: 0,
        name: "appknox",
        project: {
          id: 1,
          platform: ENUMS.PLATFORM.ANDROID
        }
      });

      component.set("store", {
        find: function() {
          return Promise.resolve();
        }
      });

      component.send("openAPIScanModal");
      assert.equal(component.get("showAPIScanModal"), true, "API Scan Modal");
      component.set("file.project.platform", ENUMS.PLATFORM.WINDOWS);
      component.send("openAPIScanModal");

      component.send("setAPIScanOption");

      component.send("doNotRunAPIScan");
      assert.equal(component.get("isApiScanEnabled"), false, "API Scan Enabled");

      component.send("runAPIScan");
      assert.equal(component.get("isApiScanEnabled"), true, "API Scan Enabled");

      component.send("dynamicShutdown");

      component.send("showURLFilter", "api");
      component.send("showURLFilter", "dynamic");


    });

  });
});
