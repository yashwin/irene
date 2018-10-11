import Component from '@ember/component';
import ENV from 'irene/config/environment';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';
import InviteRegisterValidation from '../../validations/invite-register';

export default Component.extend({
  inviteRegisterPOJO: {}, // eslint-disable-line
  init() {
    this._super(...arguments);
    const inviteRegisterPOJO = this.inviteRegisterPOJO;
    const changeset = new Changeset(
      inviteRegisterPOJO, lookupValidator(InviteRegisterValidation), InviteRegisterValidation
    );
    this.set('changeset', changeset);
  },

  registerWithServer (data) {
    const token = this.token;
    const url = [ENV.endpoints.invite, token].join('/')
    return this.ajax.request(url, {
      method: 'POST',
      data: data
    }).then(() => {
      this.set('success', true);
    }, (errors) => {
      const changeset = this.changeset;
      Object.keys(errors.payload).forEach(key => {
        changeset.addError(key, errors.payload[key]);
      });
    });
  },
  actions: {
    register(changeset) {
      changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          const firstname = changeset.get('firstname');
          const lastname = changeset.get('lastname');
          const username = changeset.get('username');
          const password = changeset.get('password');
          const passwordConfirmation = changeset.get('passwordConfirmation');
          const phoneNumber = changeset.get('phone');
          const selectedCountryData = this.selectedCountryData;
          const fullNumber = selectedCountryData.dialCode + '-' +  phoneNumber;
          const termsAccepted = changeset.get('termsAccepted');
          this.registerWithServer({
            'first_name': firstname,
            'last_name': lastname,
            'username': username,
            'password': password,
            'confirm_password': passwordConfirmation,
            'phone': fullNumber,
            'terms_accepted': termsAccepted
          });
        }
      });
    },
    geoIpLookupFunc: function(callback) {
      this.ajax.request('https://ipinfo.io')
       .then(function(resp) {
         if (!resp || !resp.country) {
           callback('US');
           return
         }
         callback(resp.country);
       }, () => {
        callback('US');
       });
    },
  },

});
