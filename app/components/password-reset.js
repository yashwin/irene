import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';

const PasswordResetComponent = Component.extend({
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),

  uuid: "",
  token: "",
  password: "",
  confirmPassword: "",

  isResettingPassword: false,

  tPasswordLengthError: t("passwordLengthError"),
  tPasswordMatchError: t("passwordMatchError"),
  tPasswordIsReset: t("passwordIsReset"),

  validation_errors: [], // eslint-disable-line

  validate() {
    this.validation_errors = [];
    const password = this.password;

    const tPasswordLengthError = this.tPasswordLengthError;
    const tPasswordMatchError = this.tPasswordMatchError;

    if (password.length < 6) {
      this.validation_errors.push(tPasswordLengthError);
      return this.validation_errors;
    }
    const confirmPassword = this.confirmPassword;
    if (password !== confirmPassword) {
      this.validation_errors.push(tPasswordMatchError);
      return this.validation_errors;
    }
  },

  actions: {

    reset() {
      const tPasswordIsReset = this.tPasswordIsReset;
      this.validate();
      if (this.validation_errors.length > 0) {
        return this.notify.error(`${this.validation_errors.join(" & ")}`);
      }
      const password = this.password;
      const uuid = this.uuid;
      const token = this.token;
      const data = {
        uuid,
        token,
        password
      };
      this.set("isResettingPassword", true);
      this.ajax.post(ENV.endpoints.reset, {data})
      .then(() => {
        if(!this.isDestroyed) {
          this.container.lookup("route:reset").transitionTo("login");
        }
        this.notify.success(tPasswordIsReset);
      }, (error) => {
        if(!this.isDestroyed) {
          this.set("isResettingPassword", false);
          this.notify.error(error.payload.message);
        }
      });
    }
  }
});

export default PasswordResetComponent;
