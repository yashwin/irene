import Route from '@ember/routing/route';
import config from 'irene/config/environment';
import ENV from 'irene/config/environment';

export default Route.extend({
  title: `Activate${config.platform}`,
  model(params) {
    const url = [ENV.endpoints.activate, params.pk, params.token].join('/');
    return this.ajax.request(url);
  },
  redirect() {
    this.notify.info("Your account has been activated. Please login to continue");
    this.transitionTo('login');
  }
});
