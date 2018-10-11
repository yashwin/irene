import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';
import { isUnauthorizedError } from 'ember-ajax/errors';

const LoginComponentComponent = Component.extend({
  session: service('session'),
  notify: service('notification-messages-service'),
  MFAEnabled: false,
  isLogingIn: false,
  isSSOLogingIn: false,
  identification: "",
  password: "",
  otp: "",
  isNotEnterprise: !ENV.isEnterprise,
  actions: {
    authenticate() {
      let identification = this.identification;
      let password = this.password;
      const otp = this.otp;

      if (!identification || !password) {
        return this.notify.error("Please enter username and password", ENV.notifications);
      }
      identification = identification.trim();
      password = password.trim();
      this.set("isLogingIn", true);

      const errorCallback = (error) => {
        if (isUnauthorizedError(error)) {
          this.set("MFAEnabled", true);
        }
      };

      const loginStatus = () => {
        this.set("isLogingIn", false);
      };

      this.session.authenticate("authenticator:irene", identification, password, otp, errorCallback, loginStatus);
    },

    SSOAuthenticate() {
      this.set("isSSOLogingIn", true);
      const url = `${ENV.endpoints.saml2}?return_to=${window.location.origin}/saml2/redirect`;

      this.ajax.request(url)
        .then(function(data) {
          window.location.href = data.url;
        })
        .catch(function(err) {
          this.notify.error(err.payload.message);
        });
    }
  }
});

export default LoginComponentComponent;
