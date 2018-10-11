import DS from 'ember-data';
import { computed } from '@ember/object';
import BaseModeMixin from 'irene/mixins/base-model';

const Submission = DS.Model.extend(BaseModeMixin, {

  user: DS.belongsTo('user', {inverse: 'submissions'}),
  metaData: DS.attr('string'),
  status: DS.attr('number'),
  reason:DS.attr('string'),
  source: DS.attr('number'),
  packageName: DS.attr('string'),
  statusHumanized: DS.attr('string'),

  hasReason: computed("reason", function() {
    const reason = this.reason;
    return (reason != null ? reason.length : undefined) > 0;
  })

});

export default Submission;
