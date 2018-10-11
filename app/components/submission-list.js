import ENUMS from 'irene/enums';
import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { alias, gt, sort } from '@ember/object/computed';

const SubmissionListComponent = Component.extend({

  submissionCount: alias('submissions.length'),
  hasSubmissions: gt('submissionCount', 0),

  submissions: computed("realtime.SubmissionCounter", function() {
    return this.store.findAll("submission");
  }),

  submissionStatusObserver: observer("submissions.@each.status", function() {
    const submissions = this.submissions;
    const filteredSubmissions = submissions.filter(submission => submission.get("status") !== ENUMS.SUBMISSION_STATUS.ANALYZING);
    return this.set("filteredSubmissions", filteredSubmissions);
  }),

  submissionSorting: ['id:desc'], // eslint-disable-line
  sortedSubmissions: sort('filteredSubmissions', 'submissionSorting'),

  sortedSubmissionsCount: alias('filteredSubmissions.length'),
  hasSortedSubmissions: gt('sortedSubmissionsCount', 0)
});

export default SubmissionListComponent;
