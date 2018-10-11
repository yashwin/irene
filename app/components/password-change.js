import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';
import triggerAnalytics from 'irene/utils/trigger-analytics';

const isValidPassword = password=> password.length > 5;

const PasswordChangeComponent = Component.extend({
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),
  passwordCurrent: "",
  passwordNew: "",
  passwordConfirm: "",
  isChangingPassword: false,
  tEnterValidPassword: t("enterValidPassword"),
  tInvalidPassword: t("invalidPassword"),
  tPasswordChanged: t("passwordChanged"),

  actions: {
    changePassword() {
      const tEnterValidPassword = this.tEnterValidPassword;
      const tInvalidPassword = this.tInvalidPassword;
      const tPasswordChanged = this.tPasswordChanged;
      const passwordCurrent = this.passwordCurrent;
      const passwordNew = this.passwordNew;
      const passwordConfirm = this.passwordConfirm;
      for (let password of [passwordCurrent, passwordNew, passwordConfirm]) {
        if (!isValidPassword(password)) { return this.notify.error(tEnterValidPassword); }
      }
      if (passwordNew !== passwordConfirm) {
        return this.notify.error(tInvalidPassword);
      }
      const data = {
        password: passwordCurrent,
        newPassword: passwordNew
      };
      this.set("isChangingPassword", true);
      const ajax = this.ajax;
      ajax.post(ENV.endpoints.changePassword, {data})
      .then(() => {
        this.notify.success(tPasswordChanged);
        triggerAnalytics('feature',ENV.csb.changePassword);
        if(!this.isDestroyed) {
          this.set("isChangingPassword", false);
          this.setProperties({
            passwordCurrent: "",
            passwordNew: "",
            passwordConfirm: ""
            });
          setTimeout(() => window.location.href = "/", 1 * 1000);
        }
      }, (error) => {
        this.set("isChangingPassword", false);
        this.notify.error(error.payload.message);
      });
    }
  }
});

export default PasswordChangeComponent;
