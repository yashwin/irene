import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'irene/config/environment';

const AuthenticatedPaymentSuccessRoute = Route.extend({
  ajax: service(),
  notify: service('notification-messages-service'),

  beforeModel(){
    const queryParams = location.href.split('?')[1];
    this.ajax.post(`${config.endpoints.chargebeeCallback}?${queryParams}`)
    .then(() => {
       this.notify.success("Payment Successful");
     }, () => {
      this.notify.error("PAYMENT FAILED TO UPDATE!!!");
    });
  }
});

export default AuthenticatedPaymentSuccessRoute;
