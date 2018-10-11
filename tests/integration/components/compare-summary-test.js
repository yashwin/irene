import { run } from '@ember/runloop';
import ENUMS from 'irene/enums';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Integration | Component | compare summary', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // register t helper
    this.owner.register('helper:t', tHelper);
  });

  test('tapping button fires an external action', function(assert) {
    assert.expect(11);
    var component = this.owner.factoryFor('component:compare-summary').create();
    run(function() {
      component.set("comparison",
        {
          analysis1: {
            id: 1,
            risk: ENUMS.RISK.UNKNOWN
          },
          analysis2: {
            id: 2,
            risk: ENUMS.RISK.UNKNOWN
          },
          vulnerability: {
            id: 3
          }
        }
      );
      assert.deepEqual(component.get('vulnerability'), {"id": 3}, "Vulnerability");
      assert.deepEqual(component.get('file1Analysis'), {"id": 1, "risk": -1}, "File 1 Analysis");
      assert.deepEqual(component.get('file2Analysis'), {"id": 2, "risk": -1}, "File 2 Analysis");

      const cls = 'tag';
      component.set("comparison.analysis1.computedRisk", ENUMS.RISK.UNKNOWN);
      component.set("comparison.analysis2.computedRisk", ENUMS.RISK.UNKNOWN);
      assert.equal(component.get('compareColor'), cls + " " + "is-progress", "Compare Color/Progress");
      assert.equal(component.get('compareText').string, "Analyzing", "Compare Text/Analyzing");

      component.set("comparison.analysis1.computedRisk", ENUMS.RISK.MEDIUM);
      component.set("comparison.analysis2.computedRisk", ENUMS.RISK.MEDIUM);
      assert.equal(component.get('compareColor'), cls + " " + "is-default", "Compare Color/Default");
      assert.equal(component.get('compareText').string, "Unchanged", "Compare Text/Unchanged");

      component.set("comparison.analysis1.computedRisk", ENUMS.RISK.HIGH);
      assert.equal(component.get('compareColor'), cls + " " + "is-critical", "Compare Color/Success");
      assert.equal(component.get('compareText').string, "Worsened", "Compare Text/Improved");

      component.set("comparison.analysis1.computedRisk", ENUMS.RISK.LOW);
      assert.equal(component.get('compareColor'), cls + " " + "is-success", "Compare Color/Danger");
      assert.equal(component.get('compareText').string, "Improved", "Compare Text/Worsened");
    });
  });
});
