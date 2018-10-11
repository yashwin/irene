import { once } from '@ember/runloop';
import { observer, computed } from '@ember/object';
import Component from '@ember/component';
import PaginateMixin from 'irene/mixins/paginate';

export default Component.extend(PaginateMixin, {
  query: "",
  targetObject: "security/file",

  sortProperties: ["-id"], // eslint-disable-line

  newFileObserver: observer("realtime.FileCount", function() {
    return this.incrementProperty("version");
  }),

  resetOffset() {
    return this.set("offset", 0);
  },

  offsetResetter: observer("query", function() {
    return (() => {
      const result = [];
      for (let property of ["query"]) {
        const propertyOldName = `_${property}`;
        const propertyNewValue = this.get(property);
        const propertyOldValue = this.get(propertyOldName);
        const propertyChanged = propertyOldValue !== propertyNewValue;
        if (propertyChanged) {
          this.set(propertyOldName, propertyNewValue);
          result.push(once(this, 'resetOffset'));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }),

  extraQueryStrings: computed("query", function() {
    const query = {
      query: this.query,
      projectId: this.get("project.projectId")
    };
    return JSON.stringify(query, Object.keys(query).sort());
  })
});
