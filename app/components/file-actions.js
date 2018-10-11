import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { on } from '@ember/object/evented';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';

export default Component.extend({

  i18n: service(),

  tPleaseTryAgain: t('pleaseTryAgain'),

  vulnerabilities: computed(function() {
    const store = this.store;
    return store.query("security/vulnerability", {'limit':0})
    .then(
      data => store.query("security/vulnerability", {'limit':data.meta.count})
    )
  }),

  fileDetails: computed(function() {
    const fileId = this.get("file.fileId");
    return this.store.findRecord("security/file", fileId);
  }),

  ireneFilePath: computed(function() {
    const fileId = this.get("file.fileId");
    const ireneHost = ENV.ireneHost;
    return [ireneHost, "file", fileId].join('/');
  }),

  openPurgeAPIAnalysisConfirmBox: task(function * () {
    yield this.set('showPurgeAPIAnalysisConfirmBox', true);
  }),

  confirmPurge: task(function * () {
    this.set('isPurgingAPIAnalysis', true);
    const fileId = this.get("file.fileId");
    const url = [ENV.endpoints.files,fileId, ENV.endpoints.purgeAPIAnalyses].join('/');
    return yield this.ajax.post(url, { namespace: 'api/hudson-api'});
  }).evented(),

  confirmPurgeSucceeded: on('confirmPurge:succeeded', function() {
    const fileId = this.get("file.fileId");
    this.store.findRecord("security/file", fileId);
    this.notify.success('Successfully Purged the Analysis');
    this.set('isPurgingAPIAnalysis', false);
    this.set('showPurgeAPIAnalysisConfirmBox', false);
  }),

  confirmPurgeErrored: on('confirmPurge:errored', function(_, error) {
    let errMsg = this.tPleaseTryAgain;
    if (error.errors && error.errors.length) {
      errMsg = error.errors[0].detail || errMsg;
    } else if(error.message) {
      errMsg = error.message;
    }

    this.notify.error(errMsg);

    this.set('isPurgingAPIAnalysis', false);
  }),

  openAddAnalysisModal: task(function *() {
    yield this.set("showAddAnalysisModal", true);
  }),

  selectVulnerabilty: task(function *(value) {
    yield this.set("selectedVulnerability", value);
  }).evented(),

  downloadApp: task(function *() {
    const fileId = this.get("file.fileId");
    const url = [ENV.endpoints.apps, fileId].join('/');
    const data = yield this.ajax.request(url, { namespace: 'api/hudson-api'})
    try {
      window.location = data.url;
    }
    catch(e) {
      throw e;
    }
  }),

  downloadAppErrored: on('downloadApp:errored', function(_, error) {
    let errMsg = this.tPleaseTryAgain;
    if (error.errors && error.errors.length) {
      errMsg = error.errors[0].detail || errMsg;
    } else if(error.message) {
      errMsg = error.message;
    }
    this.notify.error(errMsg);
  }),

  addAnalysis: task(function *() {
    const vulnerability = this.selectedVulnerability;
    const file = this.fileDetails;

    if(isEmpty(vulnerability)) {
      return this.notify.error("Please select a vulnerability");
    }

    const analysis = yield this.store.createRecord('security/analysis',
      {
        vulnerability: vulnerability,
        file: file
      }
    );
    try {
      yield analysis.save();
    }
    catch(e) {
      analysis.unloadRecord();
      throw e;
    }
  }).evented(),

  addAnalysisSucceeded: on('addAnalysis:succeeded', function() {
    this.set("showAddAnalysisModal", false);
    this.notify.success("Analysis Added Successfully");
  }),

  addAnalysisErrored: on('addAnalysis:errored', function(_, error) {
    let errMsg = this.tPleaseTryAgain;
    if (error.errors && error.errors.length) {
      errMsg = error.errors[0].detail || errMsg;
    } else if(error.message) {
      errMsg = error.message;
    }
    this.notify.error(errMsg);
  }),

  actions: {
    generateReport() {
      const fileId = this.get("file.fileId");
      const emails = this.emails;
      let data = {
      };
      if(!isEmpty(emails)) {
        data = {
          emails: emails.split(",").map(item => item.trim())
        };
      }
      this.set("isGeneratingReport", true);
      const url = [ENV.endpoints.reports, fileId].join('/');
      return this.ajax.put(url, { namespace: 'api/hudson-api', data, contentType: 'application/json'})
      .then(() => {
        this.set("isGeneratingReport", false);
        this.set("reportGenerated", true);
        this.set("emailIDs", emails.split(','));
        this.set("emails", "");
      }, (error) => {
        this.set("isGeneratingReport", false);
        for (error of error.errors) {
          this.notify.error(error.detail.error);
        }
      });
    },

    openGenerateReportModal() {
      this.set("reportGenerated", false);
      this.set("showGenerateReportModal", true);
    },

    confirmPurgeAPIAnalysisConfirmBox() {
      this.confirmPurge.perform();
    }
  }

});
