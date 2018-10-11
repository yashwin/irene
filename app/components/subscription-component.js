import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';

const SubscriptionComponentComponent = Component.extend({

  subscription: null,
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),
  tSubscriptionCancelled: t("subscriptionCancelled"),

  isCancellingSubscription: false,

  isNotPerScan: not('subscription.isPerScan'),

  confirmCallback() {
    const tSubscriptionCancelled = this.tSubscriptionCancelled;

    const subscriptionId = this.get("subscription.id");
    const url = [ENV.endpoints.subscriptions, subscriptionId].join('/');
    this.set("isCancellingSubscription", true);
    this.ajax.delete(url)
    .then(() => {
      this.notify.success(tSubscriptionCancelled);
      if(!this.isDestroyed) {
        this.set("subscription.isCancelled", true);
        this.set("isCancellingSubscription", false);
        this.send("closeCancelSubscriptionConfirmBox");
      }
    }, (error) => {
      if(!this.isDestroyed) {
        this.set("isCancellingSubscription", false);
        this.notify.error(error.payload.message);
      }
    });
  },

  actions: {

    openCancelSubscriptionConfirmBox() {
      this.set("showCancelSubscriptionConfirmBox", true);
    },

    closeCancelSubscriptionConfirmBox() {
      this.set("showCancelSubscriptionConfirmBox", false);
    }
  }
});

export default SubscriptionComponentComponent;
