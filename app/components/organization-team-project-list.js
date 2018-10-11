import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';

export default Component.extend(PaginateMixin, {
  i18n: service(),
  me: service(),

  classNames: [''],
  targetObject: 'organization-team-project',
  sortProperties: ['created:desc'], // eslint-disable-line
  extraQueryStrings: computed('team.id', function() {
    const query = {
      teamId: this.get('team.id')
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newOrganizationTeamProjectsObserver: observer("realtime.TeamProjectCounter", function() {
    return this.incrementProperty("version");
  }),
});
