import { gt } from '@ember/object/computed';
import { observer } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import PaginateMixin from 'irene/mixins/paginate';

export default Component.extend(PaginateMixin, {
  me: service(),
  i18n: service(),
  org: service('organization'),

  targetObject: 'organization-team',
  sortProperties: ['createdOn:desc'], // eslint-disable-line

  newInvitationsObserver: observer("realtime.OrganizationTeamCounter", function() {
    return this.incrementProperty("version");
  }),

  hasMember: gt('org.selected.membersCount', 0)

});
