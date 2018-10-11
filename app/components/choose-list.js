import { gt, filter } from '@ember/object/computed';
import FileListComponent from 'irene/components/file-list';

const ChooseListComponent = FileListComponent.extend({

  fileOld: null,

  hasObjects: gt('objectCount', 1),

  otherFilesInTheProject: filter('sortedObjects', function(file) {
    const fileId = this.get("fileOld.id");
    return fileId !== file.get("id");
  })
});

export default ChooseListComponent;
