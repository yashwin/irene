/* jshint ignore:start */

import Component from '@ember/component';
import { task } from 'ember-concurrency';
import ENV from 'irene/config/environment';
import { isNotFoundError } from 'ember-ajax/errors';

export default Component.extend({

  isStorageWorking: false,
  isDeviceFarmWorking: false,

  localClassNameBindings: [ // eslint-disable-line
    'isStorageWorking:storage-operational',
    'isDeviceFarmWorking:devicefarm-operational'],

  didInsertElement() {
    this.getStorageStatus.perform();
    this.getDeviceFarmStatus.perform();
  },

  getStorageStatus: task(function *() {
    try {
      let status = yield this.ajax.request(ENV.endpoints.status);
      yield this.ajax.request(status.data.storage, { headers:{ 'Authorization': "Basic"}});
    } catch(error) {
      this.set("isStorageWorking", !!isNotFoundError(error));
    }
  }).drop(),

  getDeviceFarmStatus: task(function *() {
    try {
      yield this.ajax.request(ENV.endpoints.ping);
      this.set("isDeviceFarmWorking", true);
    } catch(error) {
      this.set("isDeviceFarmWorking", false);
    }
  }).drop(),

});

/* jshint ignore:end */
