import DS from 'ember-data';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { translationMacro as t } from 'ember-i18n';

const Subscription = DS.Model.extend({
  i18n: service(),
  subscriptionId: DS.attr('string'),
  billingPeriod: DS.attr('number'),
  billingPeriodUnit: DS.attr('string'),
  planQuantity: DS.attr('number'),
  expiryDate: DS.attr('date'),
  status: DS.attr('string'),
  isActive: DS.attr('boolean'),
  isTrial: DS.attr('boolean'),
  isCancelled: DS.attr('boolean'),
  isPerScan: DS.attr('boolean'),
  planName: DS.attr('string'),

  tTrialWillExpireOn: t("trialWillExpireOn"),
  tYouWillBeChargedOn: t("youWillBeChargedOn"),
  tTrialWillBeConverted: t("trialWillBeConverted"),
  tSubscriptionWillExpireOn: t("subscriptionWillExpireOn"),

  isNotCancelled: not('isCancelled'),

  expiryDateOnHumanized: computed("expiryDate", function() {
    const expiryDate = this.expiryDate;
    return expiryDate.toLocaleDateString();
  }),

  subscriptionText: computed("isTrial", "isCancelled", function() {
    const isTrial = this.isTrial;
    const isCancelled = this.isCancelled;
    const tTrialWillExpireOn = this.tTrialWillExpireOn;
    const tYouWillBeChargedOn = this.tYouWillBeChargedOn;
    const tTrialWillBeConverted = this.tTrialWillBeConverted;
    const tSubscriptionWillExpireOn = this.tSubscriptionWillExpireOn;
    if (isTrial && isCancelled) {
      return tTrialWillExpireOn;
    }
    else if (isTrial && !isCancelled) {
      return tYouWillBeChargedOn;
    }
    else if (!isTrial && isCancelled) {
      return tTrialWillBeConverted;
    }
    else if (!isTrial && !isCancelled) {
      return tSubscriptionWillExpireOn;
    }
  })

});

export default Subscription;
