import { run } from '@ember/runloop';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | jira project', function(hooks) {
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

    var component = this.owner.factoryFor('component:jira-project').create();

    run(function() {

      component.set("project", {id:1});
      assert.notOk(component.confirmCallback());

      assert.notOk(component.fetchJiraProjects());

      component.send("openDeleteJIRAConfirmBox");
      assert.equal(component.get("showDeleteJIRAConfirmBox"),true, "Open");
      component.send("closeDeleteJIRAConfirmBox");
      assert.equal(component.get("showDeleteJIRAConfirmBox"),false, "Close");
    });
  });

  test('tapping button fires an external action', function(assert) {
    assert.expect(0);
    var component = this.owner.factoryFor('component:jira-project').create();
    this.render();
    run(function() {
      component.set("project", {id:1});
      component.send("selectProject");
    });
  });
});
