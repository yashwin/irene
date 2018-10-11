import { run } from '@ember/runloop';
import ENUMS from 'irene/enums';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import localeConfig from 'ember-i18n/config/en';

module('Unit | Model | project', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);
  });

  test('it exists', function(assert) {
    const project = run(() => this.owner.lookup('service:store').createRecord('project'));
    var store = {
      queryRecord: function() {
        return [
          {
            id:1,
            type: "file",
            attributes: {
              name: "test"
            }
          }
        ];
      }
    };
    project.set('store', store);
    assert.deepEqual(project.get("lastFile"), [{
        id:1,
        type: "file",
        attributes: {
          name: "test"
        }
      }
    ]);
    run(function() {

      assert.equal(project.get('pdfPassword'), "Unknown!", "PDF Password/Unknown");
      project.set('uuid', "abceghi-jklm-opqr-stuv-wxyz100");
      assert.equal(project.get('pdfPassword'), "wxyz100", "PDF Password");

      assert.equal(project.get('platformIconClass'), "mobile", "Platform Icon Class/mobile");
      project.set('platform', ENUMS.PLATFORM.ANDROID);
      assert.equal(project.get('platformIconClass'), "android", "Platform Icon Class/android");
      project.set('platform', ENUMS.PLATFORM.IOS);
      assert.equal(project.get('platformIconClass'), "apple", "Platform Icon Class/apple");
      project.set('platform', ENUMS.PLATFORM.WINDOWS);
      assert.equal(project.get('platformIconClass'), "windows", "Platform Icon Class/windows");


      assert.equal(project.get('isAPIScanEnabled'), false, "API Scan Enabled");
    });
  });
});
