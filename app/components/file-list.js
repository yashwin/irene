import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';

const FileListComponent = Component.extend(PaginateMixin, {

  project: null,

  targetObject: "file",
  sortProperties: ["createdOn:desc"], // eslint-disable-line

  classNames: ["columns", "margin-top"],

  extraQueryStrings: computed("project.id", function() {
    const query =
      {projectId: this.get("project.id")};
    return JSON.stringify(query, Object.keys(query).sort());
  }),


  newFilesObserver: observer("realtime.FileCounter", function() {
    return this.incrementProperty("version");
  })
}
);

export default FileListComponent;
