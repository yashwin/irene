import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | select language', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // start Mirage
    this.server = startMirage();
  });

  hooks.afterEach(function() {
    // shutdown Mirage
    this.server.shutdown();
  });

  test('it renders', function(assert) {
    var component = this.owner.factoryFor('component:select-language').create();
    component.set("i18n", {
      locale: "en",
      locales: [
        "en", "ja"
      ]
    });
    this.render();

    run(function() {

      assert.deepEqual(component.get("currentLocale"), {"locale": "en","localeString": "English"}, 'message');
      assert.deepEqual(component.get("otherLocales"), [{"locale": "ja","localeString": "日本語"}], 'message');

      component.send("setLocale");

    });
  });
});
