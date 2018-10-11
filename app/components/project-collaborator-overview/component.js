import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { on } from '@ember/object/evented';
import { translationMacro as t } from 'ember-i18n';
import ENV from 'irene/config/environment';
import triggerAnalytics from 'irene/utils/trigger-analytics';

export default Component.extend({
  i18n: service(),
  realtime: service(),
  me: service(),
  notify: service('notification-messages-service'),

  tagName: 'tr',
  showRemoveCollaboratorConfirm: false,
  isRemovingCollaborator: false,

  tCollaboratorRemoved: t('collaboratorRemoved'),
  tPleaseTryAgain: t('pleaseTryAgain'),
  tPermissionChanged: t('permissionChanged'),

  orgMember: computed(function() {
    return this.store.findRecord('organization-user', this.get('collaborator.id'));
  }),


  /* Watch for allowEdit input */
  watchProjectWrite: computed(function(){
    this.changeCollaboratorWrite.perform();
  }).observes('collaborator.write'),


  /* Save collaborator-write value */
  changeCollaboratorWrite: task(function * () {
    const clb = this.collaborator;
    yield clb.updateCollaborator(this.get('project.id'));
  }).evented(),

  changeCollaboratorWriteSucceeded: on('changeCollaboratorWrite:succeeded', function() {
    this.notify.success(this.tPermissionChanged);
  }),

  changeCollaboratorWriteErrored: on('changeCollaboratorWrite:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);
  }),


  /* Open remove-collaborator confirmation */
  openRemoveCollaboratorConfirm: task(function * () {
    yield this.set('showRemoveCollaboratorConfirm', true);
  }),


  /* Remove collaborator action */
  removeCollaborator: task(function * () {
    this.set('isRemovingCollaborator', true);

    // const clb = yield this.get('store').queryRecord('project-collaborator', {
    //   collaboratorId: this.get('collaborator.id'),
    //   id: this.get('project.id')
    // });
    const clb = this.collaborator;
    yield clb.deleteCollaborator(this.get('project.id'));
    // this.get('realtime').incrementProperty('ProjectNonCollaboratorCounter');
    yield this.store.unloadRecord(clb);

  }).evented(),

  removeCollaboratorSucceeded: on('removeCollaborator:succeeded', function() {
    this.notify.success(this.tCollaboratorRemoved);
    triggerAnalytics('feature', ENV.csb.projectCollaboratorRemove);

    this.set('showRemoveCollaboratorConfirm', false);
    this.set('isRemovingCollaborator', false);
  }),

  removeCollaboratorErrored: on('removeCollaborator:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);
    this.set('isRemovingCollaborator', false);
  }),


  actions: {
    removeCollaboratorProxy() {
      this.removeCollaborator.perform();
    }
  }

});
