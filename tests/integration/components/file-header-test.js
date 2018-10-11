import { run } from '@ember/runloop';
import ENUMS from 'irene/enums';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | file header', function(hooks) {
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
    const component = this.owner.factoryFor('component:file-header').create();
    var store = {
      findRecord: function() {
        return [
          {
            id:1,
            type: "manualscan",
            attributes: {
              name: "test"
            }
          }
        ];
      },
      queryRecord: function() {
        return [
          {
            id:1,
            type: "unknown-analysis-status",
            attributes: {
              status: true
            }
          }
        ];
      }
    };
    component.set('store', store);
    this.render();
    run(function() {
      assert.deepEqual(component.get("manualscan"), [{
          id:1,
          type: "manualscan",
          attributes: {
            name: "test"
          }
        }
      ]);
      assert.deepEqual(component.get('filteredEnvironments'), [{"key": "NO_PREFERENCE","value": 0},{"key": "STAGING","value": 1},{"key": "PRODUCTION","value": 2}], "ENVS");
      assert.deepEqual(component.get('filteredAppActions'), [{"key": "NO_PREFERENCE","value": 0},{"key": "HALT","value": 1},{"key": "PROCEED","value": 2}], "ACTIONS");
      assert.deepEqual(component.get('filteredLoginStatuses'), ["yes", "no"], "LOGIN");
      assert.deepEqual(component.get('filteredVpnStatuses'), ["yes", "no"], "VPN");
      assert.notDeepEqual(component.get('chartOptions'));
      assert.notDeepEqual(component.get('barChartOptions'));
      assert.equal(component.didInsertElement(), undefined, "Register Password Copy");
      assert.equal(component.willDestroyElement(), undefined, "Remove Password Copy");

      component.send("addUserRole");
      component.set("newUserRole", "Admin");
      component.set("username", "yash");
      component.set("password", "testpassword");
      component.send("addUserRole");
      component.set("manualscan",
        {
          userRoles: [
            {
              id: 1
            },
            {
              id: 2
            },
            {
              id: 3
            },
          ]
        });
      component.send("addUserRole");
      assert.deepEqual(component.get("allUserRoles"), [{"id": 2},{"id": 3},{"id": 4}], "User Roles");
      assert.equal(component.confirmCallback(), undefined, "User Roles");

      component.send('displayAppInfo');
      assert.equal(component.get("isBasicInfo"), true, "Basic Info");
      component.send('displayLoginDetails');
      assert.equal(component.get("isLoginDetails"), true, "Login Details");
      component.send('displayVPNDetails');
      assert.equal(component.get("isVPNDetails"), true, "VPN Details");

      component.send('openSubscribeModal');
      assert.equal(component.get("showSubscribeModal"), true, "Close Subscribe Modal");
      component.send('closeSubscribeModal');
      assert.equal(component.get("showSubscribeModal"), false, "Open Subscribe Modal");

      component.send('openManualScanModal');
      assert.equal(component.get("showManualScanModal"), true, "Close Manual Scan Modal");
      component.send('closeManualScanModal');
      assert.equal(component.get("showManualScanModal"), false, "Open Manual Scan Modal");

      component.send('openRescanModal');
      assert.equal(component.get("showRescanModal"), true, "Close Manual Scan Modal");
      component.send('closeRescanModal');
      assert.equal(component.get("showRescanModal"), false, "Open Manual Scan Modal");


      component.set("file", {
        id:1,
        setBootingStatus() {
          return true;
        },
        setShuttingDown() {
          return true;
        },
        name: "appknox",
        project: {
          id: 1,
          platform: ENUMS.PLATFORM.ANDROID
        }
      });

      component.send("getPDFReportLink");

      component.set("manualscan", {
        filteredAppEnv:"Staging",
        filteredAppAction: "Proceed",
        minOsVersion: 10.3,
        contact: {
          name: "yash",
          email:  "yash@appknox.com"
        },
        loginRequired: true,
        userRoles: [],
        vpnRequired: true,
        vpnDetails: {},
        additionalComments: "test"
      });

      component.send("saveManualScanForm");

      component.set("manualscan.userRoles", [{id: 1, role: "Admin"},{id: 2, role: "Admin"},{id: 3, role: "Admin"}]);

      component.send("saveManualScanForm");

      component.set("manualscan.vpnDetails", {address: "198.162.0.162", port: 8000, username: "yash",password: "test"});

      component.send("saveManualScanForm");

      component.send("rescanApp");

      component.send("loginRequired");

      component.send("selectAppEnvironment");

      component.send("vpnRequired");

      component.send("requiredAppAction");

      component.send("openRemoveUserRoleConfirmBox");

      component.send("displayScanDetails");

      component.send("vpnRequired");
      component.send("selectAppEnvironment");

      component.send("requiredAppAction");

      assert.equal(component.get("isStartingRescan"), true, "Starting Scan");

      component.set("file", {profile: {id:1}});
      assert.deepEqual(component.get("unknownAnalysisStatus"), [{
          id:1,
          type: "unknown-analysis-status",
          attributes: {
            status: true
          }
        }
      ]);

    });
  });
});
