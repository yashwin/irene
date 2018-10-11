import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-i18n';

export default Component.extend({
  i18n: service(),
  realtime: service(),
  me: service(),
  notify: service('notification-messages-service'),

  team: null,
  tagName: ["tr"], // eslint-disable-line
  isRemovingMember: false,
  showRemoveMemberPrompt: false,

  tEnterRightUserName: t("enterRightUserName"),
  tTeamMember: t("teamMember"),
  tTeamMemberRemoved: t("teamMemberRemoved"),


  /* Open remove-member prompt */
  openRemoveMemberPrompt: task(function * () {
    yield this.set("showRemoveMemberPrompt", true);
  }),


  /* Remove member */
  removeMember: task(function * (inputValue) {
    this.set('isRemovingMember', true);

    const memberName = this.get('member.user.username').toLowerCase();
    const promptedMember = inputValue.toLowerCase();
    if (promptedMember !== memberName) {
      throw new Error(this.tEnterRightUserName);
    }

    const t = this.team;
    let m = this.member;
    yield t.deleteMember(m);

  }).evented(),

  removeMemberSucceeded: on('removeMember:succeeded', function() {
    this.notify.success(this.tTeamMemberRemoved);

    this.set('showRemoveMemberPrompt', false);
    this.set('isRemovingMember', false);

    this.realtime.incrementProperty('OrganizationNonTeamMemberCounter');
  }),

  removeMemberErrored: on('removeMember:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);
    this.set('isRemovingMember', false);
  }),


  actions: {
    confirmRemoveMemberProxy(inputValue) {
      this.removeMember.perform(inputValue)
    },
  }

});
