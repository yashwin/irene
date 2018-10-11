import { sort } from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  user: DS.belongsTo('user'),
  project: DS.belongsTo('security/project'),
  analyses: DS.hasMany('security/analysis'),

  analysesSorting: ['risk:desc'], // eslint-disable-line
  sortedAnalyses: sort('analyses', 'analysesSorting'),
});
