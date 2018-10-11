// jshint ignore: start
import { inject as service } from '@ember/service';

import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import ENV from 'irene/config/environment';
import PaginateMixin from 'irene/mixins/paginate';
import { translationMacro as t } from 'ember-i18n';

const PersonaltokenListComponent = Component.extend(PaginateMixin, {

  classNames: ["column","personal-token-component"],
  i18n: service(),
  ajax: service(),
  notify: service('notification-messages-service'),


  // list tokens

  targetObject: 'personaltoken',
  sortProperties: ['created:desc'], // eslint-disable-line


  // create token

  tokenName: '',
  isGeneratingToken: false,
  tEnterTokenName: t('enterTokenName'),
  tTokenCreated: t('personalTokenGenerated'),

  actions: {
    openGenerateTokenModal() {
      this.set('showGenerateTokenModal', true);
    },

    generateToken() {
      const tokenName = this.tokenName;
      const tTokenCreated = this.tTokenCreated;
      const tEnterTokenName = this.tEnterTokenName;

      for (let inputValue of [tokenName]) {
        if (isEmpty(inputValue)) { return this.notify.error(tEnterTokenName); }
      }

      const data =
        {name: tokenName};

      this.set('isGeneratingToken', true);
      this.ajax.post(ENV.endpoints.personaltokens, {data})
      .then((data) => {
        if(!this.isDestroyed) {
          this.set('isGeneratingToken', false);
          this.store.pushPayload(data);
          this.incrementProperty("version");
          this.set('tokenName', '');
          this.set('showGenerateTokenModal', false);
        }
        this.notify.success(tTokenCreated);
      }, (error) => {
        if(!this.isDestroyed) {
          this.set('isGeneratingToken', false);
          this.notify.error(error.payload.message);
        }
      });
    }
  },


  // copy token

  tTokenCopied: t('tokenCopied'),
  tPleaseTryAgain: t('pleaseTryAgain'),

  didInsertElement() {
    const tTokenCopied = this.tTokenCopied;
    const tPleaseTryAgain = this.tPleaseTryAgain;
    // eslint-disable-next-line no-undef
    const clipboard = new Clipboard('.copy-token');
    this.set('clipboard', clipboard);

    clipboard.on('success', (e) => {
      this.notify.info(tTokenCopied);
      e.clearSelection();
    });
    clipboard.on('error', () => this.notify.error(tPleaseTryAgain));
  },

  willDestroyElement() {
    const clipboard = this.clipboard;
    clipboard.destroy();
  }
}
);


export default PersonaltokenListComponent;
