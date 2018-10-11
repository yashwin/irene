import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';


const InvitationAcceptComponent = Component.extend({

  invitation: null,
  ajax: service(),
  notify: service('notification-messages-service'),

  actions: {
    acceptInvite() {
      const data = {
        invitationUuid: this.get("invitation.id"),
        username: this.username,
        password: this.password
      };
      this.ajax.post(ENV.endpoints.signup, {data})
      .then(() => {
        // FIXME: This should be this.transitionTo`
        this.notify.success("User got created sucessfully", ENV.notifications);
        if(!this.isDestroyed) {
          setTimeout(() => window.location.href = "/", 3 * 1000);
        }
      }, (error) => {
        this.notify.error(error.payload.message, ENV.notifications);
      });
    }
  }
});

export default InvitationAcceptComponent;
