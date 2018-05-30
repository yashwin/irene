import Ember from 'ember';

export default Ember.Component.extend({
  faqs: [
    {
      question: "How to upload an app?",
      answer: "Click on Upload App on the top and upload an app. The app will be uploaded & the static scan will start automatically. You can upload an iOS or an android app"
    },
    {
      question: "How to change the device preference?",
      answer: "Go to Project Settings -> On the Device Preference section, click on Change Device -> Select the preferred Device Type & OS Version -> Click on Select the device"
    },
    {
      question: "How to perform a dynamic scan?",
      answer: "test"
    },
    {
      question: "How to perform an API scan?",
      answer: "test"
    },
    {
      question: "How to get report password?",
      answer: "test"
    },
    {
      question: "How to add teams to a project as a collaboration?",
      answer: "test"
    }
  ]
});
