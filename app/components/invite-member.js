import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';
import { translationMacro as t } from 'ember-i18n';
import { task } from 'ember-concurrency';
import ENV from 'irene/config/environment';
import { on } from '@ember/object/evented';
import triggerAnalytics from 'irene/utils/trigger-analytics';

export default Component.extend(PaginateMixin, {
  i18n: service(),
  realtime: service(),

  email: '',
  isInvitingMember: false,
  showInviteMemberModal: false,

  tEmptyEmailId: t("emptyEmailId"),
  tOrgMemberInvited: t('orgMemberInvited'),
  tPleaseTryAgain: t('pleaseTryAgain'),


  /* Open invite-member modal */
  openInviteMemberModal: task(function * () {
    yield this.set('showInviteMemberModal', true);
  }),


  /* Send invitation */
  inviteMember: task(function * () {
    const email = this.email;
    if(isEmpty(email)) {
      throw new Error(this.tEmptyEmailId);
    }

    this.set('isInvitingMember', true);

    const t = this.team;
    if (t) {
      yield t.createInvitation({email});
    } else {
      const orgInvite = yield this.store.createRecord('organization-invitation', {email});
      yield orgInvite.save();
    }

    // signal to update invitation list
    this.realtime.incrementProperty('InvitationCounter');
  }).evented(),

  inviteMemberSucceeded: on('inviteMember:succeeded', function() {
    this.notify.success(this.tOrgMemberInvited);
    this.set("email", '');
    this.set('showInviteMemberModal', false);
    this.set('isInvitingMember', false);
    triggerAnalytics('feature', ENV.csb.inviteMember);
  }),

  inviteMemberErrored: on('inviteMember:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }
    this.notify.error(errMsg);
    this.set('isInvitingMember', false);
  })

});
