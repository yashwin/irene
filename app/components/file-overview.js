import Component from '@ember/component';
import { computed } from '@ember/object';

const FileOverviewComponent = Component.extend({
  file: null,
  fileOld: null,
  classNames: ["card","file-card", "is-fullwidth", "margin-bottom20"],

  unknownAnalysisStatus: computed(function() {
    return this.store.queryRecord('unknown-analysis-status', {id: this.profileId});
  }),

  chartOptions: (() =>
    ({
      legend: { display: false },
      animation: {animateRotate: false}
    })
  ).property()
});

export default FileOverviewComponent;
