import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-i18n';
import ENUMS from 'irene/enums';

export default Component.extend({
  i18n: service(),
  me: service(),
  notify: service('notification-messages-service'),

  tagName: ["tr"], // eslint-disable-line
  roles: ENUMS.ORGANIZATION_ROLES.CHOICES.slice(0, -1),
  member: null,
  organization: null,

  tUserRoleUpdated: t('userRoleUpdated'),
  tPleaseTryAgain: t('pleaseTryAgain'),


  /* Change member role */
  selectMemberRole: task(function * () {
    const role = parseInt(this.$('#org-user-role').val());

    const member = yield this.member;
    member.set('role', role);
    yield member.save();

  }).evented(),

  selectMemberRoleSucceeded: on('selectMemberRole:succeeded', function() {
    this.notify.success(this.tUserRoleUpdated);
  }),

  selectMemberRoleErrored: on('selectMemberRole:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);
  }),

});
