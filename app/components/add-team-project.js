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
  isAddingProject: false,
  showAddTeamProjectModal: false,

  tTeamProjectAdded: t('teamProjectAdded'),
  tPleaseTryAgain: t('pleaseTryAgain'),

  targetObject: 'organization-project',
  sortProperties: ['created:desc'], // eslint-disable-line
  extraQueryStrings: computed('team.id', 'searchQuery', function() {
    const query = {
      q: this.searchQuery,
      exclude_team: this.get('team.id')
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newOrganizationNonTeamProjectsObserver: observer('realtime.OrganizationNonTeamProjectCounter', function() {
    return this.incrementProperty('version');
  }),


  /* Open add-team-project modal */
  openAddProjectModal: task(function * () {
    yield this.set('showAddTeamProjectModal', true);
  }),


  /* Add project to team */
  addTeamProject: task(function * (project) {
    this.set('isAddingProject', true);
    const data = {
      write: false
    };
    const team = this.team;
    yield team.addProject(data, project.id);

    this.realtime.incrementProperty('TeamProjectCounter');
    this.sortedObjects.removeObject(project);
  }).evented(),

  addTeamProjectSucceeded: on('addTeamProject:succeeded', function() {
    this.notify.success(this.tTeamProjectAdded);

    this.set('isAddingProject', false);
    this.set('query', '');
  }),

  addTeamProjectErrored: on('addTeamProject:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);

    this.set('isAddingProject', false);
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
