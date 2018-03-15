import Ember from 'ember';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { test, moduleForComponent } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

moduleForComponent('jira-project', 'Integration | Component | jira project', {
  unit: true,
  needs: [
    'service:i18n',
    'component:confirm-box',
    'service:ajax',
    'service:notification-messages-service',
    'service:session',
    'locale:en/translations',
    'locale:en/config',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment'
  ],
  beforeEach() {
    // set the locale and the config
    Ember.getOwner(this).lookup('service:i18n').set('locale', 'en');
    this.register('locale:en/config', localeConfig);

    // register t helper
    this.register('helper:t', tHelper);

    // start Mirage
    this.server = startMirage();
  },
  afterEach() {
    // shutdown Mirage
    this.server.shutdown();
  }
});

test('tapping button fires an external action', function(assert) {

  var component = this.subject();
  this.render();

  Ember.run(function() {

    component.set("project", {id:1});
    assert.equal(component.confirmCallback(),undefined, "Confirm Callback");

    component.send("openDeleteJIRAConfirmBox");
    assert.equal(component.get("showDeleteJIRAConfirmBox"),true, "Open");
    component.send("closeDeleteJIRAConfirmBox");
    assert.equal(component.get("showDeleteJIRAConfirmBox"),false, "Close");

    component.send("selectProject");

  });
});
