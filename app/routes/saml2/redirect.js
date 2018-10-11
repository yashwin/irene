import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'irene/config/environment';

export default Route.extend({
  title: `Redirect${config.platform}`,
  session: service('session'),
  model(params) {
    this.session.authenticate("authenticator:saml2", params.sso_token);
  },
  queryParams: {
    sso_token: {
      refreshModel: true
    }
  }
});
