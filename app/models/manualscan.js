import DS from 'ember-data';
import ENUMS from 'irene/enums';
import { computed } from '@ember/object';

const Manualscan = DS.Model.extend({
  contact: DS.attr(),
  userRoles: DS.attr(),
  vpnDetails: DS.attr(),
  appEnv: DS.attr('string'),
  appAction: DS.attr('string'),
  vpnRequired: DS.attr('boolean'),
  minOsVersion: DS.attr('string'),
  loginRequired: DS.attr('boolean'),
  additionalComments: DS.attr('string'),

  filteredAppEnv: computed("appEnv", function() {
    const appEnv = parseInt(this.appEnv);
    if (isNaN(appEnv)) {
      return ENUMS.APP_ENV.NO_PREFERENCE;
    }
    return appEnv;
  }),

  filteredAppAction: computed("appAction", function() {
    const appAction = parseInt(this.appAction);
    if (isNaN(appAction)) {
      return ENUMS.APP_ACTION.NO_PREFERENCE;
    }
    return appAction;
  }),

  showProceedText: computed("appAction", function() {
    const appAction = this.appAction;
    if (appAction === "proceed") {
      return true;
    }
    return false;
  }),

  loginStatus: computed("loginRequired", function() {
    if (this.loginRequired) {
      return "yes";
    }
    return "no";
  }),

  vpnStatus: computed("vpnRequired", function() {
    if (this.vpnRequired) {
      return "yes";
    }
    return "no";
  })
});

export default Manualscan;
