import ENUMS from 'irene/enums';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, gt, equal, sort } from '@ember/object/computed';
import $ from 'jquery';

const PricingListComponent = Component.extend({

  paymentDuration: ENUMS.PAYMENT_DURATION.MONTHLY,

  subscriptions: computed(function() {
    this.store.findAll("subscription")
    .then((data) => {
      this.set("subscriptions", data);
      if (data.isLoaded === true) {
        const plans = this.store.findAll("plan");
        this.set("plans", plans);
      }
    });
  }),

  subscription: alias('subscriptions.firstObject'),

  subscriptionCount: alias('subscriptions.length'),

  hasSubscription: gt('subscriptionCount', 0),

  hasNoSubscription: equal('subscriptionCount', 0),

  sortPlanProperties: ['id'], // eslint-disable-line
  sortedPlans: sort('plans', 'sortPlanProperties'),

  durations: computed(function() {
    const durations = ENUMS.PAYMENT_DURATION.CHOICES;
    return durations.slice(0, +(durations.length-2) + 1 || undefined);
  }),

  activateDuration(element) {
    // eslint-disable-next-line no-undef
    $(".js-duration-button").removeClass("is-primary is-active");
    // eslint-disable-next-line no-undef
    $(".js-duration-button").addClass("is-default");
    // eslint-disable-next-line no-undef
    $(element).removeClass("is-default");
    // eslint-disable-next-line no-undef
    $(element).addClass("is-primary is-active");
  },

  didRender() {
    const paymentDuration = this.paymentDuration;
    // eslint-disable-next-line no-undef
    const element = $(this.element).find(`[data-value='${paymentDuration}']`);
    this.activateDuration(element);
  },

  actions: {
    selectDuration() {
      // eslint-disable-next-line no-undef
      this.set("paymentDuration", $(event.srcElement).data("value"));
      this.activateDuration(event.srcElement);
    }
  }
});

export default PricingListComponent;
