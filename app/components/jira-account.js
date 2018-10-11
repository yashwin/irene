import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';
import triggerAnalytics from 'irene/utils/trigger-analytics';

const JiraAccountComponent = Component.extend({

  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),
  user: null,
  jiraHost: "",
  jiraUsername: "",
  jiraPassword: "",

  isRevokingJIRA: false,
  isIntegratingJIRA: false,

  tJiraIntegrated: t("jiraIntegrated"),
  tJiraWillBeRevoked: t("jiraWillBeRevoked"),
  tPleaseEnterAllDetails: t("pleaseEnterAllDetails"),


  confirmCallback() {
    const tJiraWillBeRevoked = this.tJiraWillBeRevoked;
    this.set("isRevokingJIRA", true);
    this.ajax.post(ENV.endpoints.revokeJira)
    .then(() => {
      this.notify.success(tJiraWillBeRevoked);
      if(!this.isDestroyed) {
        this.set("isRevokingJIRA", false);
        this.set("user.hasJiraToken", false);
        this.send("closeRevokeJIRAConfirmBox");
      }
    }, (error) => {
      if(!this.isDestroyed) {
        this.set("isRevokingJIRA", false);
        this.notify.error(error.payload.error);
      }
    });
  },

  actions: {

    integrateJira() {
      const tJiraIntegrated = this.tJiraIntegrated;
      const tPleaseEnterAllDetails = this.tPleaseEnterAllDetails;
      const host =  this.jiraHost.trim();
      const username =  this.jiraUsername.trim();
      const password =  this.jiraPassword;
      if (!host || !username || !password) {
        return this.notify.error(tPleaseEnterAllDetails, ENV.notifications);
      }
      const data = {
        host,
        username,
        password
      };
      this.set("isIntegratingJIRA", true);
      this.ajax.post(ENV.endpoints.integrateJira, {data})
      .then(() => {
        if(!this.isDestroyed) {
          this.set("isIntegratingJIRA", false);
          this.set("user.hasJiraToken", true);
        }
        this.notify.success(tJiraIntegrated);
        triggerAnalytics('feature',ENV.csb.integrateJIRA);
      }, (error) => {
        if(!this.isDestroyed) {
          this.set("isIntegratingJIRA", false);
          this.notify.error(error.payload.message);
        }
      });

    },

    openRevokeJIRAConfirmBox() {
      this.set("showRevokeJIRAConfirmBox", true);
    },

    closeRevokeJIRAConfirmBox() {
      this.set("showRevokeJIRAConfirmBox", false);
    }
  }
});

export default JiraAccountComponent;
