import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-i18n';
import ENV from 'irene/config/environment';
import triggerAnalytics from 'irene/utils/trigger-analytics';

export default Component.extend({
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),
  realtime: service(),

  tagName: ['tr'], // eslint-disable-line
  isDeletingInvitation: false,
  isResendingInvitation: false,
  showDeleteInvitationConfirmBox: false,
  showResendInvitationConfirmBox: false,

  tInvitationReSent: t('invitationReSent'),
  tInvitationDeleted: t('invitationDeleted'),
  tPleaseTryAgain: t('pleaseTryAgain'),


  /* Open resend-invitation confirmation */
  openResendInvitationConfirmBox: task(function * () {
    yield this.set('showResendInvitationConfirmBox', true);
  }),

  /* Resend invitation */
  confirmResend: task(function * () {
    this.set('isResendingInvitation', true);
    const invite = this.invitation;
    const orgInvite = yield this.store.find('organization-invitation', invite.get('id'));
    yield orgInvite.resend();
  }).evented(),

  confirmResendSucceeded: on('confirmResend:succeeded', function() {
    this.notify.success(this.tInvitationReSent);
    triggerAnalytics('feature', ENV.csb.inviteResend);

    this.set('showResendInvitationConfirmBox', false);
    this.set('isResendingInvitation', false);
  }),

  confirmResendErrored: on('confirmResend:errored', function(_, error) {
    let errMsg = this.tPleaseTryAgain;
    if (error.errors && error.errors.length) {
      errMsg = error.errors[0].detail || errMsg;
    } else if(error.message) {
      errMsg = error.message;
    }

    this.notify.error(errMsg);

    this.set('showResendInvitationConfirmBox', false);
    this.set('isResendingInvitation', false);
  }),


  /* Open delete-invitation confirmation */
  openDeleteInvitationConfirmBox: task(function * () {
    yield this.set('showDeleteInvitationConfirmBox', true);
  }),


  /* Delete invitation */
  confirmDelete: task(function * () {
    this.set('isDeletingInvitation', true);

    const invite = this.invitation;
    const orgInvite = yield this.store.find('organization-invitation', invite.get('id'));
    yield orgInvite.deleteRecord();
    yield orgInvite.save();

    // signal to update invitation list
    this.realtime.decrementProperty('InvitationCounter');

  }).evented(),

  confirmDeleteSucceeded: on('confirmDelete:succeeded', function() {
    this.notify.success(this.tInvitationDeleted);
    triggerAnalytics('feature', ENV.csb.inviteDelete);

    this.set('showDeleteInvitationConfirmBox', false);
    this.set('isDeletingInvitation', false);
  }),

  confirmDeleteErrored: on('confirmDelete:errored', function(_, error) {
    let errMsg = this.tPleaseTryAgain;
    if (error.errors && error.errors.length) {
      errMsg = error.errors[0].detail || errMsg;
    } else if(error.message) {
      errMsg = error.message;
    }

    this.notify.error(errMsg);
    this.set('isDeletingInvitation', false);
  }),


  actions: {
    confirmResendProxy() {
      this.confirmResend.perform();
    },
    confirmDeleteProxy() {
      this.confirmDelete.perform();
    },
  }
});
