import Service, { inject as service } from '@ember/service';
import ENV from 'irene/config/environment';

const OrganizationService = Service.extend({
  selected: null,
  // host: ENV.host,
  // namespace: ENV.namespace,

  store: service('store'),
  // ajax: Ember.inject.service('ajax'),
  notify: service('notification-messages'),

  async load() {
    const orgs = await this.store.findAll('organization');
    const selectedOrg = orgs.get('firstObject');
    if (selectedOrg) {
      // const url = `${this.get('host')}/${this.get('namespace')}/organizations/${selectedOrg.id}/me`;
      // const me = await this.get('ajax').request(url);
      // this.set('me', me);
      this.set('selected', selectedOrg);
    } else {
      this.notify.error(
        "Organization is missing Contact Support", ENV.notifications
      );
    }
  }
});

export default OrganizationService;
