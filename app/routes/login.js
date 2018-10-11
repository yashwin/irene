import Route from '@ember/routing/route';
import config from 'irene/config/environment';

const LoginRoute = Route.extend({

  title: `Login${config.platform}`});

export default LoginRoute;
