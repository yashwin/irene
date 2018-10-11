import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Component | team overview', function(hooks) {
  setupTest(hooks);

  test('tapping button fires an external action', function(assert) {

    var component = this.owner.factoryFor('component:team-overview').create();
    run(function() {
      component.send('openDeleteTeamPrompt');
      assert.equal(component.get('showDeleteTeamPrompt'),true, "Open Modal");
      component.send('closeDeleteTeamPrompt');
      assert.equal(component.get('showDeleteTeamPrompt'),false, "Close Modal");
    });
  });
});
