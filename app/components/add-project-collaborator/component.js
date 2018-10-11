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
  isAddingCollaborator: false,
  showAddProjectCollaboratorModal: false,

  tProjectCollaboratorAdded: t('projectCollaboratorAdded'),
  tPleaseTryAgain: t('pleaseTryAgain'),

  targetObject: 'organization-member',
  sortProperties: ['created:desc'], // eslint-disable-line
  extraQueryStrings: computed('collaborator.id', 'searchQuery', function() {
    const query = {
      q: this.searchQuery,
      exclude_project: this.get('project.id')
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newProjectNonCollaboratorCountersObserver: observer('realtime.ProjectNonCollaboratorCounter', function() {
    return this.incrementProperty('version');
  }),


  /* Open add-project-collaborator modal */
  openAddCollaboratorModal: task(function * () {
    yield this.set('showAddProjectCollaboratorModal', true);
  }),


  /* Add collaborator to project */
  addProjectCollaborator: task(function * (member) {
    this.set('isAddingCollaborator', true);

    const prj = yield this.store.queryRecord('organization-project', {id: this.get('project.id')});
    const data = {
      write: false
    };
    yield prj.addCollaborator(data, member.id);

    this.realtime.incrementProperty('ProjectCollaboratorCounter');
    this.sortedObjects.removeObject(member);
  }).evented(),

  addProjectCollaboratorSucceeded: on('addProjectCollaborator:succeeded', function() {
    this.notify.success(this.tProjectCollaboratorAdded);

    this.set('isAddingCollaborator', false);
    this.set('query', '');
  }),

  addProjectCollaboratorErrored: on('addProjectCollaborator:errored', function(_, err) {
    let errMsg = this.tPleaseTryAgain;
    if (err.errors && err.errors.length) {
      errMsg = err.errors[0].detail || errMsg;
    } else if(err.message) {
      errMsg = err.message;
    }

    this.notify.error(errMsg);

    this.set('isAddingCollaborator', false);
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
