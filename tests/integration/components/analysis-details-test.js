import { run } from '@ember/runloop';
import ENUMS from 'irene/enums';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { startMirage } from 'irene/initializers/ember-cli-mirage';

module('Integration | Component | analysis details', function(hooks) {
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

    var component = this.owner.factoryFor('component:analysis-details').create();
    this.render();
    run(function() {
      component.set("risks", ENUMS.RISK.CHOICES.slice(0, -1));
      component.set('analysis', {computedRisk:ENUMS.RISK.NONE});
      assert.deepEqual(component.get("filteredRisks"),
        [
          {"key": "NONE","value": 0},
          {"key": "LOW","value": 1},
          {"key": "MEDIUM","value": 2},
          {"key": "HIGH","value": 3},
          {"key": "CRITICAL","value": 4}
        ], 'Filtered Risks');
      assert.equal(component.get("markedRisk"), 0, 'Marked Risk');
      assert.equal(component.get('riskClass'), "is-success", "Success");
      component.set('analysis', {computedRisk:ENUMS.RISK.LOW});
      assert.equal(component.get('riskClass'), "is-info", "Info");
      component.set('analysis', {computedRisk:ENUMS.RISK.MEDIUM});
      assert.equal(component.get('riskClass'), "is-warning", "Warning");
      component.set('analysis', {computedRisk:ENUMS.RISK.HIGH});
      assert.equal(component.get('riskClass'), "is-danger", "Danger");
      component.set('analysis', {computedRisk:ENUMS.RISK.CRITICAL});
      assert.equal(component.get('riskClass'), "is-critical", "Critical");
      component.set('analysis', {computedRisk:ENUMS.RISK.UNKNOWN});
      assert.equal(component.get('progressClass'), "is-progress", "Progress");
      component.send('toggleVulnerability');
      assert.equal(component.get('showVulnerability'),true, "Show Vulnerability");

      component.send('openEditAnalysisModal');
      // component.send('selectMarkedAnalyis');
      // component.send('selectMarkedAnalyisType');
      component.send('removeMarkedAnalysis');
      component.set('analysis', {file: {id: 1}, vulnerability: {id: 1}});
      component.send('markAnalysis');
      component.send('editMarkedAnalysis');
      component.send('cancelEditMarkingAnalysis');
      component.send('resetMarkedAnalysis');
      component.send('openResetMarkedAnalysisConfirmBox');
      assert.notOk(component.confirmCallback());

      component.set("analysis", {vulnerability: {types: []}});
      assert.deepEqual(component.get("tags"), [], 'Empty Types');

      component.set("analysis", {vulnerability: {types: [1]}, file: {isStaticDone:true}});
      assert.deepEqual(component.get("tags")[0], {"status": true,"text": "static"}, 'Risk Type');
      component.set("analysis", {vulnerability: {types: [2]}, file: {isDynamicDone:true}});
      assert.deepEqual(component.get("tags")[0], {"status": true,"text": "dynamic"}, 'Risk Type');
      component.set("analysis", {vulnerability: {types: [3]}, file: {isManualDone:true}});
      assert.deepEqual(component.get("tags")[0], {"status": true,"text": "manual"}, 'Risk Type');
      component.set("analysis", {vulnerability: {types: [4]}, file: {isApiDone:true}});
      assert.deepEqual(component.get("tags")[0], {"status": true,"text": "api"}, 'Risk Type');
    });
  });
});
