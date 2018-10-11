import Route from '@ember/routing/route';
import config from 'irene/config/environment';
import ScrollTopMixin from 'irene/mixins/scroll-top';

const AuthenticatedSettingsRoute = Route.extend(ScrollTopMixin, {

  title: `Settings${config.platform}`,
  model() {
    return this.modelFor("authenticated");
  },
  redirect(model, transition){
    const currentRoute = transition.targetName;
    if(currentRoute === "authenticated.settings.index") {
        this.transitionTo('/settings/general');
    }
  }
});

export default AuthenticatedSettingsRoute;
