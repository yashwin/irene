import Route from '@ember/routing/route';
import config from 'irene/config/environment';

const RecoverRoute = Route.extend({
  title: `Recover Password${config.platform}`});

export default RecoverRoute;
