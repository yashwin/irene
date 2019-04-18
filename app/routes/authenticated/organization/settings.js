import Route from '@ember/routing/route';
import config from 'irene/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  organization: service(),

  title: `Settings${config.platform}`,

  async model(){
    return {
      user: await this.modelFor("authenticated"),
      organization: await this.get('organization.selected'),
    }
  }
});
