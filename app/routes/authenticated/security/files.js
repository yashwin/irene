import Route from '@ember/routing/route';
import config from 'irene/config/environment';

export default Route.extend({
  title: `All Files${config.platform}`,
});
