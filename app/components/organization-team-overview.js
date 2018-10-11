import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { translationMacro as t } from 'ember-i18n';
import { task } from 'ember-concurrency';
import { on } from '@ember/object/evented';

const TeamOverviewComponent = Component.extend({
  i18n: service(),
  me: service(),

  team: null,
  isDeletingTeam: false,
  showDeleteTeamPrompt: false,

  tEnterRightTeamName: t('enterRightTeamName'),
  tTeamDeleted: t('teamDeleted'),
  tPleaseTryAgain: t('pleaseTryAgain'),


  /* Open delete-team confirmation */
  openDeleteTeamConfirmBox: task(function * () {
    yield this.set('showDeleteTeamPrompt', true);
  }),


  /* Delete team */
  confirmDelete: task(function * (inputValue) {
    this.set('isDeletingTeam', true);
    const t = this.team;
    const teamName = t.get("name").toLowerCase();
    const promptedTeam = inputValue.toLowerCase();
    if (promptedTeam !== teamName) {
      throw new Error(this.tEnterRightTeamName);
    }
    t.deleteRecord();
    yield t.save();

  }).evented(),

  confirmDeleteSucceeded: on('confirmDelete:succeeded', function() {
    this.notify.success(`${this.get('team.name')} ${this.tTeamDeleted}`);
    this.set('showDeleteTeamPrompt', false);
    this.set('isDeletingTeam', false);
  }),

  confirmDeleteErrored: on('confirmDelete:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }
    this.notify.error(errMsg);
    this.set('isDeletingTeam', false);
  }),


  actions: {
    confirmDeleteProxy(inputValue) {
      this.confirmDelete.perform(inputValue);
    },
  }

});


export default TeamOverviewComponent;
