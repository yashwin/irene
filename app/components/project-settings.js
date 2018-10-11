import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  isGeneralSettings: true,
  isAnalysisSettings: false,

  generalSettingsClass: computed('isGeneralSettings', function() {
    if (this.isGeneralSettings) {
      return 'is-active';
    }
  }),

  analysisSettingsClass: computed('isAnalysisSettings', function() {
    if (this.isAnalysisSettings) {
      return 'is-active';
    }
  }),

  actions: {
    displayGeneralSettings() {
      this.set('isGeneralSettings', true);
      this.set('isAnalysisSettings', false);
    },

    displaAnalysisSettings() {
      this.set('isGeneralSettings', false);
      this.set('isAnalysisSettings', true);
    }
  }
});
