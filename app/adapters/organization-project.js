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
  _buildURL: function(modelName, id) {
    const baseurl = `${this.host}/${this.namespace}/organizations/${this.organization.selected.id}/projects`;
    if (id) {
      return `${baseurl}/${encodeURIComponent(id)}`;
    }
    return baseurl;
  },

  addCollaborator(store, type, snapshot, data, collaboratorId) {
    let id = snapshot.id;
    const url = this.urlForAddCollaborator(id, type.modelName, snapshot, collaboratorId);
    return this.ajax(url, 'PUT', {data});
  },
  urlForAddCollaborator(id, modelName, snapshot, collaboratorId) {
    const baseURL = this._buildURL(modelName, id);
    return [baseURL, 'collaborators', collaboratorId].join('/');
  },
});
