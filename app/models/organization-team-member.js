import { computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  user: computed('id', function() {
    return this.store.findRecord('organization-user', this.id);
  }),
});
