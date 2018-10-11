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

  _buildURL(modelName, id) {
    const baseURL = `${this.host}/${this.namespace}/organizations/${this.organization.selected.id}/teams`;
    if (id) {
      return `${baseURL}/${encodeURIComponent(id)}`;
    }
    return baseURL;
  },

  _buildNestedURL(modelName, teamId, id) {
    const teamURL = this._buildURL(modelName, teamId);
    const projectURL = [teamURL, 'members'].join('/');
    if (id) {
      return `${projectURL}/${encodeURIComponent(id)}`;
    }
    return projectURL;
  },

  urlForQuery(query, modelName) {
    return this._buildNestedURL(modelName, query.teamId);
  },
});
