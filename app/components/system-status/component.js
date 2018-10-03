/* jshint ignore:start */

import Ember from 'ember';
import { task } from 'ember-concurrency';
import ENV from 'irene/config/environment';
import {isNotFoundError} from 'ember-ajax/errors';

export default Ember.Component.extend({

  isStorageWorking: false,
  isDeviceFarmWorking: false,

  localClassNameBindings: [
    'isStorageWorking:storage-operational',
    'isDeviceFarmWorking:devicefarm-operational'],

  didInsertElement() {
    this.get("getStorageStatus").perform();
    this.get('getDeviceFarmStatus').perform();
  },

  getStorageStatus: task(function *() {
    try {
      let status = yield this.get("ajax").request(ENV.endpoints.status);
      yield this.get('ajax').request(status.data.storage, { headers:{ 'Authorization': "Basic"}});
    } catch(error) {
      this.set("isStorageWorking", !!isNotFoundError(error));
    }
  }).drop(),

  getDeviceFarmStatus: task(function *() {
    try {
      yield this.get("ajax").request(ENV.endpoints.ping);
      this.set("isDeviceFarmWorking", true);
    } catch(error) {
      this.set("isDeviceFarmWorking", false);
    }
  }).drop(),

});

/* jshint ignore:end */
