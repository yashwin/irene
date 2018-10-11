import DS from 'ember-data';
import { computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';

const Invoice = DS.Model.extend({

  i18n: service(),
  paidOn: DS.attr('date'),
  amount: DS.attr('string'),
  isPaid: DS.attr('boolean'),
  planName: DS.attr('string'),
  invoiceId: DS.attr('number'),
  downloadUrl: DS.attr('string'),

  tPending: t("pending"),
  tPaid: t("paid"),
  tUnpaid: t("unpaid"),

  paidOnHumanized: computed("paidOn", function() {
    const paidOn = this.paidOn;
    return paidOn.toLocaleDateString();
  }),

  paidDate: computed("paidOnHumanized", "isPaid", function() {
    const tPending = this.tPending;
    if (this.isPaid) {
      return this.paidOnHumanized;
    }
    return tPending;
  }),

  paidStatus: computed("isPaid", function() {
    const tPaid = this.tPaid;
    const tUnpaid = this.tUnpaid;
    if (this.isPaid) {
      return tPaid;
    }
    return tUnpaid;
  })
});

export default Invoice;
