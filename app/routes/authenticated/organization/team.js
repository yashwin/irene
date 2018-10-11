import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'irene/config/environment';
import ScrollTopMixin from 'irene/mixins/scroll-top';

export default Route.extend(ScrollTopMixin, {
  me: service(),
  organization: service(),

  title: `Team${config.platform}`,

  async model(params){
    const orgId = this.organization.selected.id;
    return {
      team: await this.store.find('organization-team', params.teamId),
      organization: await this.store.find('organization', orgId)
    };
  }
});
