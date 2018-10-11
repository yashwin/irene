import DS from 'ember-data';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';


export default DS.Model.extend({
  apiUrlFilters: DS.attr('string'),

  apiUrlFilterItems: computed("apiUrlFilters", function() {
    const apiUrlFilters = this.apiUrlFilters;
    if (!isEmpty(apiUrlFilters)) {
      return (apiUrlFilters != null ? apiUrlFilters.split(",") : undefined);
    }
  }),

  hasApiUrlFilters: alias('apiUrlFilterItems.length')

});
