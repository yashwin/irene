import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';
import triggerAnalytics from 'irene/utils/trigger-analytics';


export default Component.extend({
  i18n: service(),
  realtime: service(),
  me: service(),
  notify: service('notification-messages-service'),

  tagName: ['tr'], // eslint-disable-line
  showRemoveTeamConfirm: false,
  isRemovingTeam: false,

  tTeamRemoved: t('teamRemoved'),
  tPleaseTryAgain: t('pleaseTryAgain'),
  tPermissionChanged: t('permissionChanged'),


  /* Watch for allowEdit input */
  watchProjectWrite: computed(function(){
    this.changeTeamWrite.perform();
  }).observes('team.write'),

  /* Save team-write value */
  changeTeamWrite: task(function * () {
    const prj = yield this.store.queryRecord('organization-team-project', {
      teamId: this.get('team.id'),
      id: this.get('project.id')
    });
    prj.set('write', this.get('team.write'));
    yield prj.updateProject(this.get('team.id'));
  }).evented(),

  changeTeamWriteSucceeded: on('changeTeamWrite:succeeded', function() {
    this.notify.success(this.tPermissionChanged);
  }),

  changeTeamWriteErrored: on('changeTeamWrite:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);
  }),


  /* Open remove-team confirmation */
  openRemoveTeamConfirm: task(function * () {
    yield this.set('showRemoveTeamConfirm', true);
  }),


  /* Remove team action */
  removeTeam: task(function * () {
    this.set('isRemovingTeam', true);

    const prj = yield this.store.queryRecord('organization-team-project', {
      teamId: this.get('team.id'),
      id: this.get('project.id')
    });
    const team = this.team;
    yield prj.deleteProject(team.id);
    this.realtime.incrementProperty('ProjectNonTeamCounter');
    yield this.store.unloadRecord(team);

  }).evented(),

  removeTeamSucceeded: on('removeTeam:succeeded', function() {
    this.notify.success(this.tTeamRemoved);
    triggerAnalytics('feature', ENV.csb.projectTeamRemove);

    this.set('showRemoveTeamConfirm', false);
    this.set('isRemovingTeam', false);
  }),

  removeTeamErrored: on('removeTeam:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);
    this.set('isRemovingTeam', false);
  }),


  actions: {
    removeTeamProxy() {
      this.removeTeam.perform();
    }
  }

});
