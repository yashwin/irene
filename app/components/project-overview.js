import Component from '@ember/component';

const ProjectOverviewComponent = Component.extend({
  project: null,
  tagName: '',
  classNames: ['projectClassSelector:mp-plus:mp-minus'],
  projectClassSelector: false,
  showMoreDetails: false,
  actions: {
    toggleFileDetails() {
      this.set("projectClassSelector", this.get("showMoreDetails"));
      this.set("showMoreDetails", !this.get("showMoreDetails"));
    },

  }
  // classNames: ["column" , "is-half"]
});
export default ProjectOverviewComponent;
