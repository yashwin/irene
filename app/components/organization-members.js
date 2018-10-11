import { inject as service } from '@ember/service';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';

export default Component.extend(PaginateMixin, {
  me: service(),
});
