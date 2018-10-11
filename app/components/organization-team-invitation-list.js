import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';


export default Component.extend(PaginateMixin, {
  i18n: service(),
  me: service(),

  targetObject: 'organization-team-invitation',
  sortProperties: ['createdOn:desc'], // eslint-disable-line

  extraQueryStrings: computed('team.id', function() {
    const query = {
      'teamId': this.get('team.id'),
      'is_accepted': false
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newInvitationsObserver: observer("realtime.InvitationCounter", function() {
    return this.incrementProperty("version");
  })
});
