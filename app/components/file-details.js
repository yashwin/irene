import ENUMS from 'irene/enums';
import { sort } from '@ember/object/computed';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import $ from 'jquery';

const FileDetailsComponent = Component.extend({

  ajax: service(),

  sortImpactAscending: false,

  isSecurityEnabled: false,

  vulnerabilityType: ENUMS.VULNERABILITY_TYPE.UNKNOWN,
  vulnerabilityTypes: ENUMS.VULNERABILITY_TYPE.CHOICES.slice(0, -1),

  analyses: computed("file.sortedAnalyses", function() {
    return this.get("file.sortedAnalyses");
  }),

  analysesObserver: observer('analyses.@each', function() {
    this.updateUnhiddenAnalysis();
  }),

  didInsertElement() {
    this.securityEnabled();
  },

  securityEnabled() {
    this.ajax.request("projects", {namespace: 'api/hudson-api'})
    .then(() => {
      if(!this.isDestroyed) {
        this.set("isSecurityEnabled", true);
      }
    }, () => {
      if(!this.isDestroyed) {
        this.set("isSecurityEnabled", false);
      }
    });
  },

  updateUnhiddenAnalysis() {
    const unhiddenAnalyses = this.sortUnhiddenAnalyses();
    this.set("sortedUnhiddenAnalyses", unhiddenAnalyses);
  },

  sortUnhiddenAnalyses() {
    const vulnerabilityType = parseInt(this.vulnerabilityType);
    const analyses = this.analyses;
    if (vulnerabilityType === ENUMS.VULNERABILITY_TYPE.UNKNOWN) {
      return analyses;
    }
    const filteredAnalysis = [];
    for (let analysis of analyses) {
      if (analysis.hasType(vulnerabilityType)) {
        filteredAnalysis.push(analysis);
      }
    }
    return filteredAnalysis;
  },

  sortedUnhiddenAnalyses: computed(function() {
    return this.sortUnhiddenAnalyses();
  }),

  sortedAnalyses: sort('sortedUnhiddenAnalyses', 'analysesSorting'),

  actions: {
    filterVulnerabilityType() {
      this.set("sortedUnhiddenAnalyses", this.get("file.sortedAnalyses"));
      this.set("sortImpactAscending", false);
      // eslint-disable-next-line no-undef
      const select = $(this.element).find("#filter-vulnerability-type");
      this.set("vulnerabilityType", select.val());
      this.updateUnhiddenAnalysis();
    },

    sortByImpact() {
      const sortImpactAscending = this.sortImpactAscending;
      if(!sortImpactAscending) {
        this.set("analysesSorting", ['computedRisk:asc']);
        this.set("sortImpactAscending", true);
      }
      else {
        this.set("analysesSorting", ['computedRisk:desc']);
        this.set("sortImpactAscending", false);
      }
      const sortedAnalyses = this.sortedAnalyses;
      this.set("sortedUnhiddenAnalyses", sortedAnalyses);
    }
  }
});

export default FileDetailsComponent;
