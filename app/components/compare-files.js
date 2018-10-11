import { getOwner } from '@ember/application';
import { filter } from '@ember/object/computed';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { translationMacro as t } from 'ember-i18n';

const CompareFilesComponent = Component.extend({

  file1: null,
  file2: null,
  isSummary: true,
  isReverse: false,

  i18n: service(),
  tCompareWarningOldFile: t("compareWarningOldFile"),
  tCompareWarningSameFiles: t("compareWarningSameFiles"),

  summaryClass: computed("isSummary", function() {
    if (this.isSummary) {
      return "is-active";
    }
  }),

  detailsClass: computed("isSummary", function() {
    if (!this.isSummary) {
      return "is-active";
    }
  }),

  selectedBaseFile: alias('file1.id'),
  selectedCompareFile: alias('file2.id'),

  allFiles: computed("file1.{project.id", "id}", "file2.id", function() {
    const projectId = this.get("file1.project.id");
    const allFiles = [];
    this.store.query("file", {projectId:projectId, limit: 1000})
    .then((data) => {
      data.content.forEach((item) => {
        allFiles.push(item.id);
        this.set("allFiles", allFiles);
      });
    });
  }),

  compareText: computed(function() {
    const file1Id = parseInt(this.get("file1.id"));
    const file2Id = parseInt(this.get("file2.id"));
    const tCompareWarningOldFile = this.tCompareWarningOldFile;
    const tCompareWarningSameFiles = this.tCompareWarningSameFiles;
    if(file1Id === file2Id) {
      return tCompareWarningSameFiles;
    }
    else if(file1Id < file2Id) {
      return tCompareWarningOldFile;
    }
  }).property("file1.id", "file2.id"),

  allBaseFiles: filter('allFiles', function(file) {
    return file !== this.get("file1.id");
  }).property("file1.id", "allFiles"),

  allCompareFiles: filter('allFiles', function(file) {
    return file !== this.get("file2.id");
  }).property("file2.id", "allFiles"),

  comparisons: computed(function() {
    const comparisons = [];
    const file1Analyses = this.get("file1.analyses");
    const file2Analyses = this.get("file2.analyses");
    if (!file1Analyses || !file2Analyses) { return; }
    file1Analyses.forEach(function(analysis) {
      const vulnerability = analysis.get("vulnerability");
      const vulnerability_id  = parseInt(vulnerability.get("id"));
      if (!comparisons[vulnerability_id]) { comparisons[vulnerability_id] = {}; }
      comparisons[vulnerability_id]["analysis1"] = analysis;
      return comparisons[vulnerability_id]["vulnerability"] = vulnerability;
    });
    file2Analyses.forEach(function(analysis) {
      const vulnerability = analysis.get("vulnerability");
      const vulnerability_id  = parseInt(vulnerability.get("id"));
      if (!comparisons[vulnerability_id]) { comparisons[vulnerability_id] = {}; }
      comparisons[vulnerability_id]["analysis2"] = analysis;
      return comparisons[vulnerability_id]["vulnerability"] = vulnerability;
    });
    comparisons.removeObject(undefined);
    return comparisons;
  }).property("file1.analyses.@each.risk", "file2.analyses.@each.risk"),


  actions: {
    displaySummary() {
      this.set("isSummary", true);
    },

    displayDetails() {
      this.set("isSummary", false);
    },

    compareFiles() {
      const selectedBaseFile = this.selectedBaseFile;
      const selectedCompareFile = this.selectedCompareFile;
      const comparePath = `${selectedBaseFile}...${selectedCompareFile}`;
      getOwner(this).lookup('route:authenticated').transitionTo("authenticated.compare", comparePath);
    },

    selectBaseFile() {
      this.set("selectedBaseFile", parseInt(this.$('#base-file-id').val()));
      this.send("compareFiles");
    },

    selectCompareFile() {
      this.set("selectedCompareFile", parseInt(this.$('#compare-file-id').val()));
      this.send("compareFiles");
    }
  }
});

export default CompareFilesComponent;
