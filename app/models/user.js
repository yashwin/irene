import DS from 'ember-data';
import ENUMS from 'irene/enums';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';
import { not, alias, gt } from '@ember/object/computed';

const User = DS.Model.extend({

  i18n: service(),

  uuid: DS.attr('string'),
  lang: DS.attr('string'),
  username: DS.attr('string'),
  email: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  ownedProjects: DS.hasMany('project', {inverse:'owner'}),
  projects: DS.hasMany('project'),
  pricings: DS.hasMany('pricing'),
  submissions: DS.hasMany('submission', {inverse:'user'}),
  namespaces: DS.attr('string'),
  expiryDate: DS.attr('date'),
  devknoxExpiry: DS.attr('date'),
  projectCount: DS.attr('number'),
  hasGithubToken: DS.attr('boolean'),
  hasJiraToken: DS.attr('boolean'),
  socketId: DS.attr('string'),
  limitedScans: DS.attr('boolean'),
  scansLeft: DS.attr('number'),
  githubRedirectUrl: DS.attr('string'),
  billingHidden: DS.attr('boolean'),
  mfaMethod: DS.attr('number'),
  mfaSecret: DS.attr('string'),
  isTrial: DS.attr('boolean'),
  intercomHash: DS.attr('string'),
  isSecurity: true, // FIXME:

  isNotSecurity: not('isSecurity'),

  tProject: t("project"),
  tProjects: t("projects"),
  tNoProject: t("noProject"),

  provisioningURL: computed("mfaSecret", "email", function() {
    const mfaSecret = this.mfaSecret;
    const email = this.email;
    return `otpauth://totp/Appknox:${email}?secret=${mfaSecret}&issuer=Appknox`;
  }),

  mfaEnabled: computed("mfaMethod", function() {
    const mfaMethod = this.mfaMethod;
    if (mfaMethod === ENUMS.MFA_METHOD.TOTP) {
      return true;
    }
    return false;
  }),

  totalProjects: computed("projectCount", function() {
    const tProject = this.tProject;
    const tNoProject = this.tNoProject;
    const projectCount = this.projectCount;
    const tProjects = this.tProjects.string.toLowerCase();
    if (projectCount === 0) {
      return tNoProject;
    } else if (projectCount === 1) {
      return `${projectCount} ${tProject}`;
    }
    return `${projectCount} ${tProjects}`;
  }),

  ifBillingIsNotHidden: computed("billingHidden", function() {
    if (ENV.isEnterprise) {
      return false;
    }
    const billingHidden = this.billingHidden;
    return !billingHidden;
  }),

  getExpiryDate: computed("expiryDate", function() {
    if (ENV.isAppknox) {
      return this.expiryDate;
    } else {
      return this.devknoxExpiry;
    }
  }),

  hasExpiryDate: computed("getExpiryDate", function() {
    const getExpiryDate = this.getExpiryDate;
    if (isEmpty(getExpiryDate)) {
      return false;
    } else {
      return true;
    }
  }),

  expiryText: computed("expiryDate", function() {
    const currentDate = new Date();
    const expiryDate = this.expiryDate;
    let prefix = "subscriptionWillExpire";
    if (currentDate > expiryDate) {
      prefix = "subscriptionExpired";
    }
    return prefix;
  }),

  namespaceItems: computed("namespaces", function() {
    const namespaces = this.namespaces;
    return (namespaces != null ? namespaces.split(",") : undefined);
  }),

  namespacesCount: alias('namespaces.length'),

  hasNamespace: gt('namespacesCount', 0),

  hasProject: gt('projectCount', 0)
});

export default User;
