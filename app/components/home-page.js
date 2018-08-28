import Ember from 'ember';
import triggerAnalytics from 'irene/utils/trigger-analytics';

const {inject: {service}} = Ember;

export default Ember.Component.extend({

  session: service(),

  isLoaded: false,
  isSecurityEnabled: false,
  isSecurityDashboard: false,
  organization: service('organization'),

  org: (function() {
    return this.get('organization.selected');
  }).property('organization.selected'),

  securityEnabled() {
    this.get("ajax").request("projects", {namespace: 'hudson-api'})
    .then(() => {
      this.set("isSecurityEnabled", true);
      this.securityDashboard();
    }, () => {
      this.set("isSecurityEnabled", false);
      this.securityDashboard();
    });
  },

  securityDashboard() {
    if(window.location.pathname.startsWith("/security")) {
      const isSecurityEnabled = this.get("isSecurityEnabled");
      if(isSecurityEnabled) {
        this.set("isSecurityDashboard", true);
      }
      else {
        Ember.getOwner(this).lookup('route:authenticated').transitionTo("authenticated.projects");
      }
      this.set("isLoaded", true);
    }
    else {
      this.set("isLoaded", true);
    }
  },

  didInsertElement() {
    this.securityEnabled();
  },

  actions: {
    invalidateSession() {
      triggerAnalytics('logout');
      this.get('session').invalidate();
    }
  }

});
