import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import ENV from 'irene/config/environment';

export default Component.extend({
  actions: {
    purgeAPIAnalyses() {
      const fileId = this.fileNumber;
      if (isEmpty(fileId)) {
        return this.notify.error("Please enter any File ID");
      }
      this.set("isPurgingAPIAnalyses", true);
      const url = [ENV.endpoints.files,fileId, ENV.endpoints.purgeAPIAnalyses].join('/');
      return this.ajax.post(url, { namespace: 'api/hudson-api'})
      .then(() => {
        this.set("isPurgingAPIAnalyses", false);
        this.notify.success("Successfully Purged the Analysis");
        this.set("fileNumber", "");
      }, (error) => {
        this.set("isPurgingAPIAnalyses", false);
        for (error of error.errors) {
          this.notify.error(error.detail.error);
        }
      });
    }
  }
});
