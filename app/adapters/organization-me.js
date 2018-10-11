import { inject as service } from '@ember/service';
import DRFAdapter from './drf';
import ENV from 'irene/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DRFAdapter.extend(DataAdapterMixin, {
  host: ENV.host,
  namespace: ENV.namespace,
  addTrailingSlashes: false,
  authorizer: 'authorizer:irene',
  organization: service('organization'),
  _buildURL: function() {
    const baseURL = `${this.host}/${this.namespace}/organizations/${this.organization.selected.id}/me`;
    return baseURL;
  }
});
