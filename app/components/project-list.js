import $ from 'jquery';
import ENUMS from 'irene/enums';
import { once } from '@ember/runloop';
import Component from '@ember/component';
import { underscore } from '@ember/string';
import { gt } from '@ember/object/computed';
import PaginateMixin from 'irene/mixins/paginate';
import { observer, computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';
import { inject as service } from '@ember/service';
import { filterPlatformValues } from 'irene/helpers/filter-platform';

const ProjectListComponent = Component.extend(PaginateMixin, {

  i18n: service(),

  classNames: ["columns"],
  projects: null,
  hasProjects: gt('projects.meta.count', 0),
  query: "",
  targetObject: "OrganizationProject",

  sortingKey: "lastFileCreatedOn",
  sortingReversed: true,
  platformType: ENUMS.PLATFORM.UNKNOWN,

  tDateUpdated: t("dateUpdated"),
  tDateCreated: t("dateCreated"),
  tProjectName: t("projectName"),
  tPackageName: t("packageName"),
  tMostRecent: t("mostRecent"),
  tLeastRecent: t("leastRecent"),

  newProjectsObserver: observer("realtime.ProjectCounter", function() {
    return this.incrementProperty("version");
  }),

  sortProperties: computed("sortingKey", "sortingReversed", function() {
    let sortingKey = this.sortingKey;
    const sortingReversed = this.sortingReversed;
    if (sortingReversed) {
      sortingKey = `${sortingKey}:desc`;
    }
    return [sortingKey];
  }),

  resetOffset() {
    return this.set("offset", 0);
  },

  offsetResetter: observer("query", "sortingKey", "sortingReversed", "platformType", function() {
    return (() => {
      const result = [];
      for (let property of ["query", "sortingKey", "sortingReversed", "platformType"]) {
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


  extraQueryStrings: computed("query", "sortingKey", "sortingReversed", "platformType", function() {
    const platform = this.platformType
    const reverse = this.sortingReversed
    const sorting = underscore(this.sortingKey)

    const query = {
      q: this.query,
      sorting: sorting
    };
    if(platform != null && platform != -1) {
      query["platform"] = platform;
    }
    if (reverse) {
      query["sorting"] = '-' + sorting;
    }
    return JSON.stringify(query, Object.keys(query).sort());
  }),

  sortingKeyObjects: computed(function() {
    const tDateUpdated = this.tDateUpdated;
    const tDateCreated = this.tDateCreated;
    const tPackageName = this.tPackageName;
    const tLeastRecent = this.tLeastRecent;
    const tMostRecent = this.tMostRecent;
    const keyObjects = [
      { key: "lastFileCreatedOn", text: tDateUpdated },
      { key: "id", text: tDateCreated },
      { key: "packageName", text: tPackageName }
    ];
    const keyObjectsWithReverse = [];
    for (let keyObject of Array.from(keyObjects)) {
      for (let reverse of [true, false]) {
        const keyObjectFull = {};
        keyObjectFull.reverse = reverse;
        keyObjectFull.key = keyObject.key;
        keyObjectFull.text = keyObject.text;
        if (reverse) {
          if (["lastFileCreatedOn", "id"].includes(keyObject.key)) {
            keyObjectFull.text += tMostRecent;
          } else {
            keyObjectFull.text += "(Z -> A)";
          }
        } else {
          if (["lastFileCreatedOn", "id"].includes(keyObject.key)) {
            keyObjectFull.text += tLeastRecent;
          } else {
            keyObjectFull.text += "(A -> Z)";
          }
        }
        keyObjectsWithReverse.push(keyObjectFull);
      }
    }
    return keyObjectsWithReverse;
  }),

  platformObjects: ENUMS.PLATFORM.CHOICES.slice(0, +-4 + 1 || undefined),
  actions: {
    sortProjects() {
      // eslint-disable-next-line no-undef
      const select = $(this.element).find("#project-sort-property");
      const [sortingKey, sortingReversed] = filterPlatformValues(select.val());
      this.set("sortingKey", sortingKey);
      this.set("sortingReversed", sortingReversed);
    },

    filterPlatform() {
      // eslint-disable-next-line no-undef
      const select = $(this.element).find("#project-filter-platform");
      this.set("platformType", select.val());
    }
  }
}
);

export default ProjectListComponent;
