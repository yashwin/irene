import ENUMS from 'irene/enums';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';

const CompareSummaryComponent = Component.extend({
  i18n: service(),
  comparison: null,

  tagName: ["tr"], // eslint-disable-line

  tAnalyzing: t("analyzing"),
  tUnchanged: t("unchanged"),
  tImproved: t("improved"),
  tWorsened: t("worsened"),

  vulnerability: computed("comparison", function() {
    return this.comparison["vulnerability"];
  }),

  file1Analysis: computed("comparison", function() {
    return this.comparison['analysis1'];
  }),

  file2Analysis: computed("comparison", function() {
    return this.comparison['analysis2'];
  }),

  compareColor: computed("file1Analysis.computedRisk", "file2Analysis.computedRisk", function() {
    const cls = 'tag';
    const file1Risk = this.get("file1Analysis.computedRisk");
    const file2Risk = this.get("file2Analysis.computedRisk");
    if ([file1Risk, file2Risk].includes(ENUMS.RISK.UNKNOWN)) {
      return `${cls} is-progress`;
    } else if (file1Risk === file2Risk) {
      return `${cls} is-default`;
    } else if (file1Risk < file2Risk) {
      return `${cls} is-success`;
    } else if (file1Risk > file2Risk) {
      return `${cls} is-critical`;
    }
  }),

  compareText: computed("file1Analysis.computedRisk", "file2Analysis.computedRisk", function () {
    let file1Risk = this.get("file1Analysis.computedRisk");
    let file2Risk = this.get("file2Analysis.computedRisk");
    const tAnalyzing = this.tAnalyzing;
    const tUnchanged = this.tUnchanged;
    const tImproved = this.tImproved;
    const tWorsened = this.tWorsened;

    if ([file1Risk, file2Risk].includes(ENUMS.RISK.UNKNOWN)) {
      return tAnalyzing;
    } else if (file1Risk === file2Risk) {
      return tUnchanged;
    } else if (file1Risk < file2Risk) {
      return tImproved;
    } else if (file1Risk > file2Risk) {
      return tWorsened;
    } else {
      return "-";
    }
  })
});


export default CompareSummaryComponent;
