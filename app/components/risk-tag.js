import ENUMS from 'irene/enums';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';

export default Component.extend({
  analysis: null,
  i18n: service(),

  tScanning: t("scanning"),
  tUntested: t("untested"),
  tRequested: t("requested"),

  scanningText: computed("analysis.{vulnerability.types,file.{dynamicStatus, manual, apiScanProgress}}", function() {
    const tScanning = this.tScanning;
    const tUntested = this.tUntested;
    const tRequested = this.tRequested;
    const types = this.get("analysis.vulnerability.types");
    if (types === undefined) { return []; }
    switch (types[0]) {
      case ENUMS.VULNERABILITY_TYPE.STATIC: {
        return tScanning;
      }
      case ENUMS.VULNERABILITY_TYPE.DYNAMIC: {
        const dynamicStatus = this.get('analysis.file.dynamicStatus');
        if(dynamicStatus !== ENUMS.DYNAMIC_STATUS.NONE) {
          return tScanning;
        }
        return tUntested;
      }
      case ENUMS.VULNERABILITY_TYPE.MANUAL: {
        if(this.get("analysis.file.manual")) {
          return tRequested;
        }
        return tUntested;
      }
      case ENUMS.VULNERABILITY_TYPE.API: {
        const apiScanProgress = this.get('analysis.file.apiScanProgress');
        if(apiScanProgress >= 1) {
          return tScanning;
        }
        return tUntested;
      }
    }
  })
});
