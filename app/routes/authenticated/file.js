import Route from '@ember/routing/route';
import config from 'irene/config/environment';
import ScrollTopMixin from 'irene/mixins/scroll-top';

const AuthenticatedFileRoute = Route.extend(ScrollTopMixin, {

  title: `File Details${config.platform}`,
  async model(params){
    await this.store.findAll('Vulnerability');
    return this.store.find('file', params.fileId);
  }
}
);

export default AuthenticatedFileRoute;
