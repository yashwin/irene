import moment from 'moment';
import Service from '@ember/service';
import ENV from 'irene/config/environment';
import { inject as service } from '@ember/service';


export default Service.extend({
  ajax: service('ajax'),
  organization: service('organization'),

  scancount: {},
  appscan: {},

  async load() {
    this.get_scancount();
    this.get_appscan();
  },

  async get_scancount() {
    const orgId = this.get("organization.selected.id");
    const scancountUrl = [ENV.endpoints.organizations, orgId, ENV.endpoints.scancount].join('/');
    const scancount = await this.get('ajax').request(scancountUrl)
    this.set("scancount", scancount);
  },

  async get_appscan() {
    const orgId = this.get("organization.selected.id");
    const endDate = new Date().toISOString();
    const startDate = moment(endDate).subtract('180', 'days').toISOString();
    let appscanUrl = [ENV.endpoints.organizations, orgId, ENV.endpoints.appscan].join('/');
    appscanUrl += `?start_date=${startDate}&end_date=${endDate}`;
    const appscan = await this.get('ajax').request(appscanUrl);
    this.set("appscan", appscan);
  }

});
