import $ from 'jquery';
import { inject as service } from '@ember/service';
import EmberUploader from 'ember-uploader';


const Uploader = EmberUploader.Uploader.extend({
  ajax: service("ajax"),
  async uploadFile(file, url) {
    const that = this;
    const settings = {
      dataType: "text",
      contentType: "application/octet-stream",
      processData: false,
      xhrFields: {
        withCredentials: false
      },
      xhr() {
        const xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = e => that.didProgress(e);
        that.one('isAborting', () => xhr.abort());
        return xhr;
      },
      data: file
    };
    return this.ajax.put(url, settings);
  },
});

export default Uploader;
