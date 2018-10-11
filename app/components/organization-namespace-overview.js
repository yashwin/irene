import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { on } from '@ember/object/evented';
import ENV from 'irene/config/environment';
import triggerAnalytics from 'irene/utils/trigger-analytics';
import { translationMacro as t } from 'ember-i18n';

export default Component.extend({
  i18n: service(),
  me: service(),
  notify: service('notification-messages-service'),

  tagName: ['tr'], // eslint-disable-line
  showRejectNamespaceConfirm: false,
  isRejectingNamespace: false,
  isApprovingNamespace: false,

  tNamespaceApproved: t('namespaceApproved'),
  tNamespaceRejected: t('namespaceRejected'),
  tPleaseTryAgain: t('pleaseTryAgain'),


  /* Approve namespace action */
  approveNamespace: task(function * () {
    this.set('isApprovingNamespace', true);

    const ns = this.namespace;
    ns.set('isApproved', true);
    yield ns.save();
  }).evented(),

  approveNamespaceSucceeded: on('approveNamespace:succeeded', function() {
    this.notify.success(this.tNamespaceApproved);
    triggerAnalytics('feature', ENV.csb.namespaceAdded);

    this.set('isApprovingNamespace', false);
  }),

  approveNamespaceErrored: on('approveNamespace:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);

    this.set('isApprovingNamespace', false);
  }),


  /* Open reject-namespace confirmation */
  rejectNamespaceConfirm: task(function * () {
    yield this.set('showRejectNamespaceConfirm', true);
  }),


  /* Reject namespace action */
  confirmReject: task(function * () {
    this.set('isRejectingNamespace', true);

    const ns = this.namespace;
    ns.deleteRecord();
    yield ns.save();

  }).evented(),

  confirmRejectSucceeded: on('confirmReject:succeeded', function() {
    this.notify.success(this.tNamespaceRejected);
    triggerAnalytics('feature', ENV.csb.namespaceRejected);

    this.set('showRejectNamespaceConfirm', false);
    this.set('isRejectingNamespace', false);
  }),

  confirmRejectErrored: on('confirmReject:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);

    this.set('isRejectingNamespace', false);
  }),


  actions: {
    confirmRejectProxy() {
      this.confirmReject.perform();
    }
  }

});
