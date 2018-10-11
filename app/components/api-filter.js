import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';
import triggerAnalytics from 'irene/utils/trigger-analytics';

const isRegexFailed = function(url) {
  const reg = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
  return reg.test(url);
};

const ApiFilterComponent = Component.extend({
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),

  newUrlFilter: null,
  deletedURL: "",

  tEmptyURL: t("emptyURL"),
  tInvalidURL: t("invalidURL"),
  tUrlUpdated: t("urlUpdated"),
  isSavingFilter: false,
  isDeletingURLFilter: false,

  apiScanOptions: computed(function() {
    return this.store.queryRecord('api-scan-options', {id: this.profileId});
  }),

  confirmCallback() {
    const apiUrlFilters = this.get("apiScanOptions.apiUrlFilters");
    const deletedURL = this.deletedURL;
    const splittedURLs = apiUrlFilters.split(",");
    const index = splittedURLs.indexOf(deletedURL);
    splittedURLs.splice(index,1);
    const joinedURLs = splittedURLs.join(",");
    this.set("updatedURLFilters", joinedURLs);
    this.set("isDeletingURLFilter", true);
    this.send("saveApiUrlFilter");
  },

  actions: {

    addApiUrlFilter() {
      let combinedURLS;
      const tInvalidURL = this.tInvalidURL;
      const tEmptyURL = this.tEmptyURL;
      const apiUrlFilters = this.get("apiScanOptions.apiUrlFilters");
      const newUrlFilter = this.newUrlFilter;
      if (isEmpty(newUrlFilter)) {
        return this.notify.error(tEmptyURL);
      }
      else {
        if (!isRegexFailed(newUrlFilter)) {
          return this.notify.error(`${newUrlFilter} ${tInvalidURL}`);
        }
      }
      if (!isEmpty(apiUrlFilters)) {
        combinedURLS = apiUrlFilters.concat("," , newUrlFilter);
      }
      else {
        combinedURLS = newUrlFilter;
      }
      this.set("updatedURLFilters", combinedURLS);
      this.send("saveApiUrlFilter");
    },

    saveApiUrlFilter() {
      const tUrlUpdated = this.tUrlUpdated;
      const updatedURLFilters = this.updatedURLFilters;
      const profileId = this.profileId;
      const url = [ENV.endpoints.profiles, profileId, ENV.endpoints.apiScanOptions].join('/');
      const data = {
        api_url_filters: updatedURLFilters
      };
      triggerAnalytics('feature', ENV.csb.addAPIEndpoints);
      this.set("isSavingFilter", true);
      this.ajax.put(url, {data})
      .then(() => {
        this.notify.success(tUrlUpdated);
        if(!this.isDestroyed) {
          this.send("closeRemoveURLConfirmBox");
          this.set("apiScanOptions.apiUrlFilters", updatedURLFilters);
          this.set("isSavingFilter", false);
          this.set("isDeletingURLFilter", false);
          this.set("newUrlFilter", "");
        }
      }, (error) => {
        if(!this.isDestroyed) {
          this.set("isSavingFilter", false);
          this.set("isDeletingURLFilter", false);
          this.notify.error(error.payload.message);
        }
      });
    },

    openRemoveURLConfirmBox() {
      this.set("deletedURL", event.target.parentElement.parentElement.firstChild.textContent);
      this.set("showRemoveURLConfirmBox", true);
    },

    closeRemoveURLConfirmBox() {
      this.set("showRemoveURLConfirmBox", false);
    }
  }
});




export default ApiFilterComponent;
