import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import ENUMS from 'irene/enums';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';

const AnalysisDetailsComponent = Component.extend({
  analysis: null,
  tagName: "article",
  mpClassSelector: true,
  classNames: ["message"],
  showVulnerability: false,
  classNameBindings: ["riskClass"],

  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),

  tSuccessfullyOverridden: t("successfullyOverridden"),
  tSuccessfullyReset: t("successfullyReset"),

  risks: computed(function() {
    const risks = ENUMS.RISK.CHOICES;
    const riskFilter = [ENUMS.RISK.NONE, ENUMS.RISK.UNKNOWN];
    return risks.filter(risk => !riskFilter.includes(risk.value));
  }),

  filteredRisks: computed("risks", "analysis.risk", function() {
    const risks = this.risks;
    const analysisRisk = this.get("analysis.risk");
    return risks.filter(risk => analysisRisk !== risk.value);
  }),

  markedRisk: computed("filteredRisks", function() {
    const filteredRisks = this.filteredRisks;
    return filteredRisks[0].value;
  }),

  riskClass: computed("analysis.computedRisk", function() {
    const risk = this.get("analysis.computedRisk");
    switch (risk) {
      case ENUMS.RISK.NONE:
        return "is-success";
      case ENUMS.RISK.LOW:
        return "is-info";
      case ENUMS.RISK.MEDIUM:
        return "is-warning";
      case ENUMS.RISK.HIGH:
        return "is-danger";
      case ENUMS.RISK.CRITICAL:
        return "is-critical";
    }
  }),

  progressClass: computed("analysis.computedRisk", function() {
    const risk = this.get("analysis.computedRisk");
    switch (risk) {
      case ENUMS.RISK.UNKNOWN:
        return "is-progress";
    }
  }),

  editAnalysisURL(type) {
    const fileId = this.get("analysis.file.id");
    const vulnerabilityId = this.get("analysis.vulnerability.id");
    const url = [ENV.endpoints.files, fileId, ENV.endpoints.vulnerabilityPreferences, vulnerabilityId, type].join('/');
    return url;
  },

  confirmCallback() {
    this.send("resetMarkedAnalysis");
  },

  tags: computed("analysis.{vulnerability.types, file.{isStaticDone,isDynamicDone,isManualDone, isApiDone}}", function() {
    const types = this.get("analysis.vulnerability.types");
    if (types === undefined) { return []; }
    const tags = [];
    for (let type of Array.from(types)) {
      if (type === ENUMS.VULNERABILITY_TYPE.STATIC) {
        tags.push({
          status: this.get("analysis.file.isStaticDone"),
          text: "static"
        });
      }
      if (type === ENUMS.VULNERABILITY_TYPE.DYNAMIC) {
        tags.push({
          status: this.get("analysis.file.isDynamicDone"),
          text: "dynamic"
        });
      }
      if (type === ENUMS.VULNERABILITY_TYPE.MANUAL) {
        tags.push({
          status: this.get("analysis.file.isManualDone"),
          text: "manual"
        });
      }
      if (type === ENUMS.VULNERABILITY_TYPE.API) {
        tags.push({
          status: this.get("analysis.file.isApiDone"),
          text: "api"
        });
      }
    }
    return tags;
  }),

  actions: {

    toggleVulnerability() {
      this.set("mpClassSelector", this.showVulnerability);
      this.set("showVulnerability", !this.showVulnerability);
    },

    openEditAnalysisModal() {
      this.set("showEditAnalysisModal", true);
    },

    selectMarkedAnalyis() {
      const markedRisk = parseInt(this.$('#marked-analysis')[0].value);
      this.set("markedRisk", markedRisk);
    },

    selectMarkedAnalyisType() {
      const markAllAnalyses = Boolean(this.$('#marked-analysis-all')[0].value);
      this.set("markAllAnalyses", markAllAnalyses);
    },

    removeMarkedAnalysis() {
      this.set("analysis.overriddenRisk", null);
    },

    markAnalysis() {
      const markedRisk = this.markedRisk;
      const markAllAnalyses = this.markAllAnalyses;
      const url = this.editAnalysisURL("risk");
      const data = {
        risk: markedRisk,
        all: markAllAnalyses
      };
      this.set("isMarkingAnalysis", true);
      this.ajax.put(url, {
        data
      }).then(() => {
        if(!this.isDestroyed) {
          this.notify.success(this.tSuccessfullyOverridden);
          this.set("isMarkingAnalysis", false);
          this.set("isEditingOverriddenRisk", false);
          this.set("analysis.overriddenRisk", markedRisk);
          this.set("analysis.computedRisk", markedRisk);
          this.set("analysis.isOverriddenRisk", true);
        }
      }, (error) => {
        this.notify.error(error.payload.message);
        this.set("isMarkingAnalysis", false);
      });
    },

    editMarkedAnalysis() {
      this.set("isEditingOverriddenRisk", true);
    },

    cancelEditMarkingAnalysis() {
      this.set("isEditingOverriddenRisk", false);
    },

    resetMarkedAnalysis() {
      const url = this.editAnalysisURL("risk");
      const data = {
        all: true
      };
      this.set("isResettingMarkedAnalysis", true);
      this.ajax.delete(url, {
        data
      }).then(() => {
        if(!this.isDestroyed) {
          this.notify.success(this.tSuccessfullyReset);
          this.set("isResettingMarkedAnalysis", false);
          this.set("showResetAnalysisConfirmBox", false);
          this.set("analysis.isOverriddenRisk", false);
          this.set("analysis.computedRisk", this.get("analysis.risk"));
        }
      }, (error) => {
        this.notify.error(error.payload.message);
        this.set("isResettingMarkedAnalysis", false);
      });
    },
    openResetMarkedAnalysisConfirmBox() {
      this.set("showResetAnalysisConfirmBox", true);
    }
  }
});

export default AnalysisDetailsComponent;
