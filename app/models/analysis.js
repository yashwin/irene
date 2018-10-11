import DS from 'ember-data';
import ENUMS from 'irene/enums';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';
import { equal, notEmpty } from '@ember/object/computed';

const Analysis = DS.Model.extend({
  findings: DS.attr(),
  risk: DS.attr('number'),
  status: DS.attr('number'),
  owasp: DS.hasMany('owasp'),
  cvssBase: DS.attr('number'),
  pcidss: DS.hasMany('pcidss'),
  cvssVector: DS.attr('string'),
  cvssVersion: DS.attr('number'),
  cvssMetricsHumanized: DS.attr(),
  computedRisk: DS.attr('number'),
  overriddenRisk: DS.attr('number'),
  analiserVersion: DS.attr('number'),
  attachments: DS.hasMany('attachment'),
  vulnerability: DS.belongsTo('vulnerability'),
  file: DS.belongsTo('file', {inverse: 'analyses'}),

  hascvccBase: equal('cvssVersion', 3),

  tLow: t("low"),
  tNone: t("none"),
  tHigh: t("high"),
  tMedium: t("medium"),
  tCritical: t("critical"),

  isOverriddenRisk: notEmpty('overriddenRisk'),

  isScanning: computed("computedRisk", function() {
    const risk = this.computedRisk;
    return risk === ENUMS.RISK.UNKNOWN;
  }),

  hasType(type) {
    const types = this.get("vulnerability.types");
    if (isEmpty(types)) {
      return false;
    }
    return types.includes(type);
  },

  isRisky: computed("computedRisk", function() {
    const risk = this.computedRisk;
    return ![ENUMS.RISK.NONE, ENUMS.RISK.UNKNOWN].includes(risk);
  }).property("computedRisk"),

  iconClass(risk) {
    switch (risk) {
      case ENUMS.RISK.UNKNOWN: return "fa-spinner fa-spin";
      case ENUMS.RISK.NONE: return "fa-check";
      case ENUMS.RISK.CRITICAL: case ENUMS.RISK.HIGH: case ENUMS.RISK.LOW: case ENUMS.RISK.MEDIUM:  return "fa-warning";
    }
  },

  riskIconClass: computed("risk", function() {
    return this.iconClass(this.risk);
  }),

  overriddenRiskIconClass: computed("overriddenRisk", function() {
    return this.iconClass(this.overriddenRisk);
  }),

  riskLabelClass: computed(function() {
    return this.labelClass(this.risk);
  }),

  overriddenRiskLabelClass: computed("overriddenRisk", function() {
    return this.labelClass(this.overriddenRisk);
  }),

  labelClass(risk) {
    const cls = 'tag';
    switch (risk) {
      case ENUMS.RISK.UNKNOWN: return `${cls} is-progress`;
      case ENUMS.RISK.NONE: return `${cls} is-success`;
      case ENUMS.RISK.LOW: return `${cls} is-info`;
      case ENUMS.RISK.MEDIUM: return `${cls} is-warning`;
      case ENUMS.RISK.HIGH: return `${cls} is-danger`;
      case ENUMS.RISK.CRITICAL: return `${cls} is-critical`;
    }
  }
});

export default Analysis;
