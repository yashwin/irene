import Ember from 'ember';
import FileListComponent from 'irene/components/file-list';

const ChooseListComponent = FileListComponent.extend({

  fileOld: null,

  hasObjects: Ember.computed.gt('objectCount', 1),

  otherFilesInTheProject: Ember.computed.filter('sortedObjects', (file) => {
    const file_id = this.get("fileOld.id");
    return file_id !== file.get("id");
  })
});

export default ChooseListComponent;
