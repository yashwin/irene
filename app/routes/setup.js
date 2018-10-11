import Route from '@ember/routing/route';
import config from 'irene/config/environment';

const SetupRoute = Route.extend({
  title: `Set Your Password${config.platform}`,
  model(params) {
    return params;
  }
});

export default SetupRoute;
