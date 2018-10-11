// jshint ignore: start
import { inject as service } from '@ember/service';

import Component from '@ember/component';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';

const isValidOTP = otp => otp.length > 5;

const AuthMfaComponent = Component.extend({

  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),
  user: null,
  showMFAIntro: true,
  showBarCode: false,
  enableMFAOTP: null,
  disableMFAOTP: null,

  isEnablingMFA: false,
  isDisablingMFA: false,

  tEnterOTP: t("enterOTP"),
  tMFAEnabled: t("mfaEnabled"),
  tMFADisabled: t("mfaDisabled"),

  didInsertElement() {
    const provisioningURL = this.get("user.provisioningURL");
    // eslint-disable-next-line no-undef
    return new QRious({
      element: this.element.querySelector("canvas"),
      background: 'white',
      backgroundAlpha: 0.8,
      foreground: 'black',
      foregroundAlpha: 0.8,
      level: 'H',
      padding: 25,
      size: 300,
      value: provisioningURL
    });
  },


  actions: {
    openMFAEnableModal() {
      this.set("showMFAEnableModal", true);
      this.set("showMFAIntro", true);
      this.set("showBarCode", false);
    },

    openMFADisableModal() {
      this.set("showMFADisableModal", true);
    },

    closeMFAEnableModal() {
      this.set("showMFAEnableModal", false);
    },

    closeMFADisableModal() {
      this.set("showMFADisableModal", false);
    },

    showBarCode() {
      this.set("showBarCode", true);
      this.set("showMFAIntro", false);
    },

    enableMFA() {
      const tEnterOTP = this.tEnterOTP;
      const tMFAEnabled = this.tMFAEnabled;
      const enableMFAOTP = this.enableMFAOTP;
      for (let otp of [enableMFAOTP]) {
        if (!isValidOTP(otp)) { return this.notify.error(tEnterOTP); }
      }
      const data =
        {otp: enableMFAOTP};
      this.set("isEnablingMFA", true);
      this.ajax.post(ENV.endpoints.enableMFA, {data})
      .then(() => {
        this.notify.success(tMFAEnabled);
        if(!this.isDestroyed) {
          this.set("enableMFAOTP", "");
          this.set("showMFAEnableModal", false);
          this.set("isEnablingMFA", false);
        }
      }, (error) => {
        if(!this.isDestroyed) {
          this.set("isEnablingMFA", false);
          this.notify.error(error.payload.message);
        }
      });
    },

    disableMFA() {
      const tEnterOTP = this.tEnterOTP;
      const tMFADisabled = this.tMFADisabled;
      const disableMFAOTP = this.disableMFAOTP;
      for (let otp of [disableMFAOTP]) {
        if (!isValidOTP(otp)) { return this.notify.error(tEnterOTP); }
      }
      const data =
        {otp: disableMFAOTP};
      this.set("isDisablingMFA", true);
      this.ajax.post(ENV.endpoints.disableMFA, {data})
      .then(() => {
        this.notify.success(tMFADisabled);
        if(!this.isDestroyed) {
          this.set("disableMFAOTP", "");
          this.set("showMFADisableModal", false);
          this.set("isDisablingMFA", false);
        }
      }, (error) => {
        if(!this.isDestroyed) {
          this.set("isDisablingMFA", false);
          this.notify.error(error.payload.message);
        }
      });
    }
  }
});


export default AuthMfaComponent;
