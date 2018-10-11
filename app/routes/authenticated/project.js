import Route from '@ember/routing/route';


const AuthenticatedProjectRoute = Route.extend({

  model(params){
    return this.store.findRecord("project", params.projectId);
  }
});

export default AuthenticatedProjectRoute;
