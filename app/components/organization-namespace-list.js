import { gt } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import PaginateMixin from 'irene/mixins/paginate';

export default Component.extend(PaginateMixin, {
  i18n: service(),
  org: service('organization'),

  classNames: ['column'],
  targetObject: 'organization-namespace',
  sortProperties: ['created:desc'], // eslint-disable-line

  hasNamespace: gt('org.selected.namespacesCount', 0)
});
