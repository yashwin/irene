import DS from 'ember-data';
import { computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';

export default DS.Model.extend({

  i18n: service(),
  deviceType: DS.attr('number'),
  platformVersion: DS.attr('string'),

  tAnyVersion: t("anyVersion"),

  versionText: computed("platformVersion", function() {
    const platformVersion = this.platformVersion;
    const tAnyVersion = this.tAnyVersion;
    if (platformVersion === "0") {
      this.set("isAnyDevice", true);
      return tAnyVersion;
    } else {
      return platformVersion;
    }
  }),

  isAnyVersion: computed("platformVersion", function() {
    const platformVersion = this.platformVersion;
    return platformVersion !== "0";
  })

});
