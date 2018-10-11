import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';

const InvoiceOverviewComponent = Component.extend({

  invoice: null,
  ajax: service(),
  notify: service('notification-messages-service'),
  tagName: ["tr"], // eslint-disable-line

  isDownloadingInvoice: false,

  actions: {
    getInvoiceLink() {
      const downloadUrl = this.get("invoice.downloadUrl");
      this.set("isDownloadingInvoice", true);
      const url = new URL(downloadUrl, ENV.host).href
      this.ajax.request(url)
      .then((result) => {
        if(!this.isDestroyed) {
          window.location = result.url;
          this.set("isDownloadingInvoice", false);
        }
      }, () => {
        this.set("isSavingStatus", false);
        this.notify.error("Sorry something went wrong, please try again");
      });
    }
  }
});

export default InvoiceOverviewComponent;
