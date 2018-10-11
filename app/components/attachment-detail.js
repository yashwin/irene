import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';

const AttachmentDetailComponent = Component.extend({
  ajax: service(),
  notify: service('notification-messages-service'),

  attachment: null,
  isDownloadingAttachment: false,

  actions: {
    downloadAttachment() {
      const url = ENV.host + this.get("attachment.downloadUrl");
      this.set("isDownloadingAttachment", true);
      this.ajax.request(url)
      .then((result) => {
        window.open(result.data.url);
        if(!this.isDestroyed) {
          this.set("isDownloadingAttachment", false);
        }
      }, (error) => {
        if(!this.isDestroyed) {
          this.set("isDownloadingAttachment", false);
          this.notify.error(error.payload.message);
        }
      });
    }
  }
});

export default AttachmentDetailComponent;
