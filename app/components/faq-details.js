import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ["message", "faq-message"],

  actions: {

    toggleFAQs() {
      this.set("showFAQs", !this.get("showFAQs"));
    }
  }
});
