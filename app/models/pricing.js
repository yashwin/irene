import DS from 'ember-data';
import { computed } from '@ember/object';

const Pricing = DS.Model.extend({

  name: DS.attr('string'),
  price: DS.attr('number'),
  description: DS.attr('string'),
  projectsLimit: DS.attr("number"),

  descriptionItems: computed("description", function() {
    const description = this.description;
    return (description != null ? description.split(",") : undefined);
  })

});

export default Pricing;
