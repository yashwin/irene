import Component from '@ember/component';
import { computed } from '@ember/object';
import ENV from 'irene/config/environment';
import { inject as service } from '@ember/service';
import { translationMacro as t } from 'ember-i18n';

const JiraProjectComponent = Component.extend({
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),
  project: null,
  jiraProjects: ["Loading..."], // eslint-disable-line


  tIntegratedJIRA: t("integratedJIRA"),
  tProjectRemoved: t("projectRemoved"),
  tRepoNotIntegrated: t("repoNotIntegrated"),
  tFetchJIRAProjectFailed: t("fetchProjectFailed"),

  confirmCallback() {
    const tProjectRemoved = this.tProjectRemoved;
    const projectId = this.get("project.id");
    const deleteJIRA = [ENV.endpoints.deleteJIRAProject, projectId].join('/');
    this.ajax.delete(deleteJIRA)
    .then(() => {
      this.notify.success(tProjectRemoved);
      if(!this.isDestroyed) {
        this.send("closeDeleteJIRAConfirmBox");
        this.set("project.jiraProject", "");
      }
    }, (error) => {
      if(!this.isDestroyed) {
        this.notify.error(error.payload.error);
      }
    });
  },

  fetchJiraProjects: computed(function() {
    const tFetchJIRAProjectFailed = this.tFetchJIRAProjectFailed;
    this.ajax.request(ENV.endpoints.jiraProjects)
    .then((data) => {
      if(!this.isDestroyed) {
        this.set("jiraProjects", data.projects);
      }
    }, () => {
      this.notify.error(tFetchJIRAProjectFailed);
    });
  }).on("init"),

  actions: {

    selectProject() {
      const project= this.$('select').val();
      const tIntegratedJIRA = this.tIntegratedJIRA;
      const tRepoNotIntegrated = this.tRepoNotIntegrated;
      const projectId = this.get("project.id");
      const url = [ENV.endpoints.setJira, projectId].join('/');

      const data =
        {project};
      this.ajax.post(url, {data})
      .then(() => {
        this.notify.success(tIntegratedJIRA);
        if(!this.isDestroyed) {
          this.set("project.jiraProject", project);
        }
      }, () => {
        this.notify.error(tRepoNotIntegrated);
      });
    },

    openDeleteJIRAConfirmBox() {
      this.set("showDeleteJIRAConfirmBox", true);
    },

    closeDeleteJIRAConfirmBox() {
      this.set("showDeleteJIRAConfirmBox", false);
    }
  }
});

export default JiraProjectComponent;
