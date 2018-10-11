import { computed } from '@ember/object';
import Component from '@ember/component';

const SettingsSplitComponent = Component.extend({

  isGeneral: true,
  isSecurity: false,
  isDeveloperSettings: false,

  generalClass: computed('isGeneral', function() {
    if (this.isGeneral) {
      return 'is-active';
    }
  }),

  securityClass: computed('isSecurity', function() {
    if (this.isSecurity) {
      return 'is-active';
    }
  }),

  developerSettingsClass: computed('isDeveloperSettings', function() {
    if (this.isDeveloperSettings) {
      return 'is-active';
    }
  }),

  didInsertElement() {
    const path = window.location.pathname;
    if(path === "/settings/security") {
      this.set("isGeneral", false);
      this.set("isSecurity", true);
      this.set("isDeveloperSettings", false);
    }
    else if(path === "/settings/developersettings") {
      this.set("isGeneral", false);
      this.set("isSecurity", false);
      this.set("isDeveloperSettings", true);
    }
  },

  actions: {
    displayGeneral() {
      this.set('isGeneral', true);
      this.set('isSecurity', false);
      this.set('isDeveloperSettings', false);
    },

    displaySecurity() {
      this.set('isGeneral', false);
      this.set('isSecurity', true);
      this.set('isDeveloperSettings', false);
    },

    displayDeveloperSettings() {
      this.set('isGeneral', false);
      this.set('isSecurity', false);
      this.set('isDeveloperSettings', true);
    }
  }
});

export default SettingsSplitComponent;
