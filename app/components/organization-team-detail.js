import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { translationMacro as t } from 'ember-i18n';
import { task } from 'ember-concurrency';
import { on } from '@ember/object/evented';

export default Component.extend({
  i18n: service(),
  me: service(),

  showEdit: false,
  saveEdit: false,

  tPleaseTryAgain: t("pleaseTryAgain"),
  tOrganizationTeamNameUpdated: t("organizationTeamNameUpdated"),


  /* Update team name */
  updateTeamName: task(function * () {
    const t = this.team;
    t.set('name', t.get('name'));
    yield t.save();
  }).evented(),

  updateTeamNameSucceeded: on('updateTeamName:succeeded', function() {
    this.notify.success(this.tOrganizationTeamNameUpdated);
    this.send("cancelEditing");
  }),

  updateTeamNameErrored: on('updateTeamName:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);
  }),


  actions: {
    updateTeam() {
      this.updateTeamName.perform();
    },
    editTeamName() {
      this.set('showEdit', true);
      this.set('saveEdit', true);
    },
    cancelEditing() {
      this.set('showEdit', false);
      this.set('saveEdit', false);
    }
  }

});
