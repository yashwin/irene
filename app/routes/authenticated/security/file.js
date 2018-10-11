import Route from '@ember/routing/route';
import config from 'irene/config/environment';

export default Route.extend({
  title: `File Details${config.platform}`,
});
