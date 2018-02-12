/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import ENV from 'irene/config/environment';

const b64EncodeUnicode = str =>
  btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(`0x${p1}`))
  )
;

const getB64Token = (user, token)=> b64EncodeUnicode(`${user}:${token}`);

const processData = function(data) {
  data.b64token = getB64Token(data.user_id, data.token);
  return data;
};

const IreneAuthenticator = Base.extend({

  ajax: Ember.inject.service(),

  resumeTransistion() {
    const authenticatedRoute = Ember.getOwner(this).lookup("route:authenticated");
    const lastTransition = authenticatedRoute.get("lastTransition");
    if (lastTransition !== null) {
      return lastTransition.retry();
    } else {
      const applicationRoute = Ember.getOwner(this).lookup("route:application");
      return applicationRoute.transitionTo(ENV['ember-simple-auth']["routeAfterAuthentication"]);
    }
  },

  authenticate(identification, password, otp, errorCallback) {
    const ajax = this.get("ajax");
    const that  = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const data = {
        username: identification,
        password,
        otp
      };

      const url = ENV['ember-simple-auth']['loginEndPoint'];
      return ajax.post(url, {data})
      .then(function(data) {
        data = processData(data);
        resolve(data);
        return that.resumeTransistion();}).catch(function(error) {
        errorCallback(error);
        that.get("notify").error(error.payload.message, ENV.notifications);
        for (error of Array.from(error.errors)) {
          if (error.status === "0") {
            that.get("notify").error("Unable to reach server. Please try after sometime", ENV.notifications);
          }
          that.get("notify").error("Please enter valid account details", ENV.notifications);
        }
        return reject(error);
      });
    });
  },

  restore(data) {
    const ajax = this.get("ajax");
    const that  = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const url = ENV['ember-simple-auth']['checkEndPoint'];
      return ajax.post(url, {data})
      .then(function(data) {
        data = processData(data);
        resolve(data);
        if (location.pathname === '/login') {
          return that.resumeTransistion();
        }}).catch(function(error) {
        localStorage.clear();
        for (error of Array.from(error.errors)) {
          that.get("notify").error(error.detail != null ? error.detail.message : undefined, ENV.notifications);
        }
        return reject(error);
      });
    });
  },

  invalidate(data) {
    const ajax = this.get("ajax");
    localStorage.clear();
    const that  = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      const url = ENV['ember-simple-auth']['logoutEndPoint'];
      return ajax.post(url)
      .then(function(data){
        resolve(data);
        return location.reload();}).catch(function(error) {
        location.reload();
        for (error of Array.from(error.errors)) {
          that.get("notify").error(error.detail != null ? error.detail.message : undefined, ENV.notifications);
        }
        return reject(error);
      });
    });
  }
});


export default IreneAuthenticator;
