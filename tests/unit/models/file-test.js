import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import ENUMS from 'irene/enums';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import localeConfig from 'ember-i18n/config/en';

module('Unit | Model | file', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);
  });

  test('it passes', function(assert) {
    run(() => {
      const file = getOwner(this).lookup(
        'service:store'
      ).createRecord('file', {
        'id': 1
      });
      assert.equal(file.get('ifManualNotRequested'), true, "Manual Requested");

      assert.equal(file.get('isRunningApiScan'), true, "API Scan");
      file.set('apiScanProgress', 100);
      assert.equal(file.get('isRunningApiScan'), false, "API Scan not done");

      assert.equal(file.scanProgressClass(), false, "Scan Progress Class");
      assert.equal(file.scanProgressClass(true), true, "Scan Progress Class");

      assert.equal(file.get('isStaticCompleted'), false, "Static Scan");

      assert.equal(file.get('isNoneStatus'), false, "None Status");

      assert.equal(file.get('isReady'), false, "Is Ready");

      assert.equal(file.get('isNeitherNoneNorReady'), true, "Is Not None Nor Ready");

      assert.equal(file.get('statusText'), "Unknown Status", 'Unknown Status');
      file.set('dynamicStatus', ENUMS.DYNAMIC_STATUS.BOOTING);
      assert.equal(file.get('statusText.string'), "Booting", 'Booting');
      file.set('dynamicStatus', ENUMS.DYNAMIC_STATUS.DOWNLOADING);
      assert.equal(file.get('statusText.string'), "Downloading", 'Downloading');
      file.set('dynamicStatus', ENUMS.DYNAMIC_STATUS.INSTALLING);
      assert.equal(file.get('statusText.string'), "Installing", 'Installing');
      file.set('dynamicStatus', ENUMS.DYNAMIC_STATUS.LAUNCHING);
      assert.equal(file.get('statusText.string'), "Launching", 'Launching');
      file.set('dynamicStatus', ENUMS.DYNAMIC_STATUS.HOOKING);
      assert.equal(file.get('statusText.string'), "Starting", 'Hooking');
      file.set('dynamicStatus', ENUMS.DYNAMIC_STATUS.SHUTTING_DOWN);
      assert.equal(file.get('statusText.string'), "Stopping", 'Shutting Down');

      assert.equal(file.setBootingStatus(), undefined, "Set Booting Status");

      assert.equal(file.setShuttingDown(), undefined, "Set Booting Status");

      assert.equal(file.setNone(), undefined, "Set Booting Status");

      assert.equal(file.setReady(), undefined, "Set Booting Status");

    });
  });
});
