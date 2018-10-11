import { run } from '@ember/runloop';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';


module('Integration | Component | team member', function(hooks) {
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

    var component = this.owner.factoryFor('component:team-member').create();

    run(function() {
      assert.equal(component.promptCallback("yash"),undefined, "Confirm Callback");
      component.set("team", {id:1});
      component.set("organizationTeam", {id:1, organization:{id:1}});
      component.set("member", "yash");
      assert.equal(component.promptCallback("yash"),undefined, "Confirm Callback");

      component.send('openRemoveMemberPrompt');
      assert.equal(component.get('showRemoveMemberPrompt'),true, "Open Modal");
      component.send('closeRemoveMemberPrompt');
      assert.equal(component.get('showRemoveMemberPrompt'),false, "Close Modal");

    });
  });
});
