import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import ENV from 'irene/config/environment';

export default Component.extend({
  actions: {
    downloadApp() {
      const fileId = this.$('#file-number').val();
      if (isEmpty(fileId)) {
        return this.notify.error("Please enter the File ID");
      }
      this.set("isDownloadingApp", true);
      const url = [ENV.endpoints.apps, fileId].join('/');
      return this.ajax.request(url, { namespace: 'api/hudson-api'})
      .then((data) => {
        this.set("isDownloadingApp", false);
        window.location = data.url;
      }, (error) => {
        this.set("isDownloadingApp", false);
        for (error of error.errors) {
          this.notify.error(error.detail.error);
        }
      });
    }
  }
});
