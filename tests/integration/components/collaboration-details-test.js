import Ember from 'ember';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { test, moduleForComponent } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

moduleForComponent('collaboration-details', 'Integration | Component | collaboration details', {
  unit: true,
  needs: [
    'component:prompt-box',
    'helper:role-humanized',
    'service:i18n',
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
    component.send('openAddCollaborationPrompt');
    component.send('closeAddCollaborationPrompt');
    assert.equal(component.get('showAddCollaborationPrompt'),false, "Collaboration Prompt");

    component.set("roles", [{value: "admin"}]);
    component.set("collaboration", [{role: "admin"}]);
    assert.deepEqual(component.get("otherRoles"), [{"value": "admin"}], 'Other Roles');

    assert.deepEqual(component.get("isDisabledSelectBox"), false, 'Default Team');

    component.send("changeRole");

  });
});