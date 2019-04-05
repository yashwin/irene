import Route from '@ember/routing/route';
import config from 'irene/config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  organization: service(),

  title: `Settings${config.platform}`,

  async model(){
    const orgId = this.get('organization').selected.id;
    return await this.get('store').find('organization', orgId);
  }
});
