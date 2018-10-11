import $ from 'jquery';
import { isEmpty } from '@ember/utils';
import Uploader from 'irene/utils/uploader';
import EmberUploader from 'ember-uploader';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';

const UploadAppComponent = EmberUploader.FileField.extend({
  store: service('store'),
  delegate: null,
  i18n: service("i18n"),

  tErrorWhileFetching: t("errorWhileFetching"),
  tErrorWhileUploading: t("errorWhileUploading"),
  tFileUploadedSuccessfully: t("fileUploadedSuccessfully"),
  notify: service("notification-messages"),

  classNames: ["file-input"],
  async filesDidChange(files) {
    const delegate = this.delegate;
    if (isEmpty(files)) {
      return;
    }
    delegate.set("isUploading", true);
    delegate.set("progress", 0);
    const uploader = Uploader.create({container: this.container});
    uploader.on('progress', e => delegate.set("progress", parseInt(e.percent)));
    try {
      const uploadItem = await this.store.queryRecord('uploadApp', {});
      await uploader.uploadFile(files[0], uploadItem.get('url'));
      await uploadItem.save()
      this.notify.success(this.tFileUploadedSuccessfully);
    } catch(e) {
      // eslint-disable-next-line no-console
      console.log(e);
      this.notify.error(this.tErrorWhileUploading);
    }
    // eslint-disable-next-line no-undef
    $('input[type=file]').val('');
    delegate.set("isUploading", false);
  },
});


export default UploadAppComponent;
