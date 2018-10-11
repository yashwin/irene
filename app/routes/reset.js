import Route from '@ember/routing/route';
import config from 'irene/config/environment';

const ResetRoute = Route.extend({
  title: `Reset Password${config.platform}`,
  model(params) {
    return params;
  }
});

export default ResetRoute;
