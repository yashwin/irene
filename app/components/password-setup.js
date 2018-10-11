import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';

const PasswordSetupComponent = Component.extend({

  ajax: service(),
  notify: service('notification-messages-service'),

  uuid: "",
  token: "",
  password: "",
  confirmPassword: "",

  validation_errors: [], // eslint-disable-line
  isSettingPassword: false,

  validate() {
    this.validation_errors = [];
    const password = this.password;

    if (password.length < 6) {
      this.validation_errors.push("Password length must be greater than or equal to 6");
      return this.validation_errors;
    }
    const confirmPassword = this.confirmPassword;
    if (password !== confirmPassword) {
      this.validation_errors.push("Passwords doesn't match");
      return this.validation_errors;
    }
  },

  actions: {

    setup() {
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
      this.set("isSettingPassword", true);
      this.ajax.post(ENV.endpoints.setup, {data})
      .then(() => {
        if(!this.isDestroyed) {
          this.set("isSettingPassword", false);
          this.container.lookup("route:setup").transitionTo("login");
        }
        this.notify.success("Password is successfully set");
      }, (error) => {
        if(!this.isDestroyed) {
          this.set("isSettingPassword", false);
          this.notify.error(error.payload.message);
        }
      });
    }
  }
});

export default PasswordSetupComponent;
