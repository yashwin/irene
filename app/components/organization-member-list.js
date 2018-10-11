import { debounce } from '@ember/runloop';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';

export default Component.extend(PaginateMixin, {
  i18n: service(),

  query: '',
  searchQuery: '',

  targetObject: 'organization-member',
  sortProperties: ['createdOn:desc'], // eslint-disable-line

  extraQueryStrings: computed('searchQuery', function() {
    const query = {
      q: this.searchQuery
    };
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  newMembersObserver: observer("realtime.OrganizationMemberCounter", function() {
    return this.incrementProperty("version");
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
