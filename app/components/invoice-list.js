import { computed } from '@ember/object';
import Component from '@ember/component';

const InvoiceListComponent = Component.extend({

  classNames:["invoice-table"],

  invoices: computed(function() {
    return this.store.findAll("invoice");
  }),

  hasInvoices: computed("invoices.@each.id", function() {
    const invoices = this.invoices;
    return invoices.get("length") > 0;
  })
});

export default InvoiceListComponent;
