import { debounce } from '@ember/runloop';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';
import { translationMacro as t } from 'ember-i18n';
import { task } from 'ember-concurrency';
import { on } from '@ember/object/evented';

export default Component.extend(PaginateMixin, {
  i18n: service(),
  realtime: service(),
  notify: service(),

  query: '',
  searchQuery: '',
  isAddingTeam: false,
  showAddProjectTeamModal: false,

  tProjectTeamAdded: t('projectTeamAdded'),
  tPleaseTryAgain: t('pleaseTryAgain'),

  targetObject: 'organization-team',
  sortProperties: ['created:desc'], // eslint-disable-line
  extraQueryStrings: computed('team.id', 'searchQuery', function() {
    const query = {
      q: this.searchQuery,
      exclude_project: this.get('project.id')
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newProjectNonTeamCountersObserver: observer('realtime.ProjectNonTeamCounter', function() {
    return this.incrementProperty('version');
  }),


  /* Open add-project-team modal */
  openAddTeamModal: task(function * () {
    yield this.set('showAddProjectTeamModal', true);
  }),


  /* Add team to project */
  addProjectTeam: task(function * (project, team) {
    this.set('isAddingTeam', true);
    const data = {
      write: false
    };
    yield team.addProject(data, project.id);

    this.realtime.incrementProperty('ProjectTeamCounter');
    this.sortedObjects.removeObject(team);
  }).evented(),

  addProjectTeamSucceeded: on('addProjectTeam:succeeded', function() {
    this.notify.success(this.tProjectTeamAdded);

    this.set('isAddingTeam', false);
    this.set('query', '');
  }),

  addProjectTeamErrored: on('addProjectTeam:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);

    this.set('isAddingTeam', false);
    this.set('query', '');
  }),

  /* Set debounced searchQuery */
  setSearchQuery() {
    this.set('searchQuery', this.query);
  },

  actions: {
    searchQuery() {
      debounce(this, this.setSearchQuery, 500);
    },
  }

});
