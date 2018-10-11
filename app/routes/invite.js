import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import ENV from 'irene/config/environment';

const InviteRoute = Route.extend({
  title: `Invitation`,
  ajax: service(),

  async model(params){
    const token = params.token;
    const url = [ENV.endpoints.invite, token].join('/')
    const ret = await this.ajax.request(url)
    return ret;
  }
});

export default InviteRoute;
