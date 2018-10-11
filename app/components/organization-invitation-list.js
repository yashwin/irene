import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';


export default Component.extend(PaginateMixin, {
  i18n: service(),

  targetObject: 'organization-invitation',
  sortProperties: ['createdOn:desc'], // eslint-disable-line
  extraQueryStrings: computed(function() {
    const query = {
      'is_accepted': false
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newInvitationsObserver: observer("realtime.InvitationCounter", function() {
    return this.incrementProperty("version");
  })
});
