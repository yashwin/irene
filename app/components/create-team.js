import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-i18n';
import ENV from 'irene/config/environment';
import triggerAnalytics from 'irene/utils/trigger-analytics';

const CreateTeamComponent = Component.extend({
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),

  teamName: "",
  isCreatingTeam: false,
  showTeamModal: false,

  tEnterTeamName: t('enterTeamName'),
  tTeamCreated: t('teamCreated'),
  tPleaseTryAgain: t('pleaseTryAgain'),


  /* Open create-team modal */
  openTeamModal: task(function * () {
    yield this.set("showTeamModal", true);
  }).evented(),


  /* Create team */
  createTeam: task(function * () {
    const teamName = this.teamName;

    if(isEmpty(teamName)) {
      throw new Error(this.tEnterTeamName);
    }

    this.set('isCreatingTeam', true);
    const t = this.store.createRecord('organization-team', {name: teamName});
    yield t.save();

    // signal to update invitation list
    this.realtime.incrementProperty('OrganizationTeamCounter');
  }).evented(),

  createTeamSucceeded: on('createTeam:succeeded', function() {
    this.notify.success(this.tTeamCreated);
    this.set("teamName", '');
    this.set('showTeamModal', false);
    this.set('isCreatingTeam', false);
    triggerAnalytics('feature', ENV.csb.createTeam);
  }),

  createTeamErrored: on('createTeam:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message
    }

    this.notify.error(errMsg);
    this.set('isCreatingTeam', false);
  }),


});


export default CreateTeamComponent;
