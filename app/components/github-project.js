import Component from '@ember/component';
import { computed } from '@ember/object';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';

const GithubProjectComponent = Component.extend({
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),
  project: null,

  isChangingRepo: false,
  isDeletingGithub: false,

  githubRepos: ["Loading..."], // eslint-disable-line

  tProjectRemoved: t("projectRemoved"),
  tRepoIntegrated: t("repoIntegrated"),
  tFetchGitHubRepoFailed: t("fetchGitHubRepoFailed"),

  confirmCallback() {
    const tProjectRemoved = this.tProjectRemoved;
    const projectId = this.get("project.id");
    const deleteGithub = [ENV.endpoints.deleteGHRepo, projectId].join('/');
    this.set("isDeletingGithub", true);
    this.ajax.delete(deleteGithub)
    .then(() => {
      this.notify.success(tProjectRemoved);
      if(!this.isDestroyed) {
        this.set("isDeletingGithub", false);
        this.set("project.githubRepo", "");
        this.send("closeDeleteGHConfirmBox");
      }
    }, (error) => {
      if(!this.isDestroyed) {
        this.set("isDeletingGithub", false);
        this.notify.error(error.payload.error);
      }
    });
  },

  fetchGithubRepos: computed(function() {
    const tFetchGitHubRepoFailed = this.tFetchGitHubRepoFailed;
    this.ajax.request(ENV.endpoints.githubRepos)
    .then((data) => {
      if(!this.isDestroyed) {
        this.set("githubRepos", data.repos);
      }
    }, () => {
      if(!this.isDestroyed) {
        this.notify.error(tFetchGitHubRepoFailed);
      }
    });
  }).on("init"),

  actions: {

    selectRepo() {
      const repo = this.$('select').val();
      const tRepoIntegrated = this.tRepoIntegrated;
      const projectId = this.get("project.id");
      const setGithub = [ENV.endpoints.setGithub, projectId].join('/');
      const data =
        {repo};
      this.set("isChangingRepo", true);
      this.ajax.post(setGithub, {data})
      .then(() => {
        if(!this.isDestroyed) {
          this.set("isChangingRepo", false);
          this.set("project.githubRepo", repo);
        }
        this.notify.success(tRepoIntegrated);
      }, (error) => {
        this.set("isChangingRepo", false);
        this.notify.error(error.payload.error);
      });
    },

    openDeleteGHConfirmBox() {
      this.set("showDeleteGHConfirmBox", true);
    },

    closeDeleteGHConfirmBox() {
      this.set("showDeleteGHConfirmBox", false);
    }
  }
});

export default GithubProjectComponent;
