import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';
import { translationMacro as t } from 'ember-i18n';
import { task } from 'ember-concurrency';
import { on } from '@ember/object/evented';
import parseEmails from 'irene/utils/parse-emails';

export default Component.extend(PaginateMixin, {
  i18n: service(),
  realtime: service(),
  organization: service(),

  emailsFromText: '',
  emailsFromFile: '',
  isAddingSSOMember: false,
  showAddSSOMemberModal: false,

  tEmptyEmailId: t('emptyEmailId'),
  tAddedSSOMembersToOrg: t('addedSSOMembersToOrg'),
  tPleaseTryAgain: t('pleaseTryAgain'),


  /* Open add-sso-member modal */
  openAddSSOMembersModal: task(function * () {
    yield this.set('showAddSSOMemberModal', true);
  }),


  /* Add SSO members to organization */
  addSSOMembers: task(function * () {
    this.set('isAddingSSOMember', true);

    const emails = parseEmails(this.emailsFromText + this.emailsFromFile);

    if(!emails.length) {
      throw new Error(this.tEmptyEmailId);
    }

    const url = `organizations/${this.organization.selected.id}/ssomembers`;
    const data = {
      emails
    };
    yield this.ajax.post(url, {data, contentType: 'application/json'});

    // signal to update members list
    this.realtime.incrementProperty('OrganizationMemberCounter');
  }).evented(),

  addSSOMembersSucceeded: on('addSSOMembers:succeeded', function() {
    this.notify.success(this.tAddedSSOMembersToOrg);

    this.set('emailsFromText', '');
    this.set('emailsFromFile', '');
    this.set('showAddSSOMemberModal', false);
    this.set('isAddingSSOMember', false);
  }),

  addSSOMembersErrored: on('addSSOMembers:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.payload && err.payload.emails && err.payload.emails.hasOwnProperty(0) && err.payload.emails[0].length) {
      errMsg = err.payload.emails[0][0] || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }
    this.notify.error(errMsg);

    this.set('isAddingSSOMember', false);
  }),

  actions: {
    uploadCsv(event) {
      let fileObj = event.currentTarget.files[0];
      var reader = new FileReader();
      var that = this;
      reader.onload = function() {
        const content = reader.result;
        that.set('emailsFromFile', content);
      }
      reader.readAsText(fileObj);
    }
  }
});
