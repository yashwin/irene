import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';

export default Component.extend(PaginateMixin, {
  i18n: service(),
  me: service(),

  classNames: [''],
  targetObject: 'project-team',
  sortProperties: ['created:desc'], // eslint-disable-line
  extraQueryStrings: computed('project.id', function() {
    const query = {
      projectId: this.get('project.id')
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newProjectTeamsObserver: observer('realtime.ProjectTeamCounter', function() {
    return this.incrementProperty('version');
  }),
});
