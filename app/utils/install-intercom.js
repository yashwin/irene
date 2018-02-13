/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import ENV from 'irene/config/environment';

const installIntercom = function() {
  if (!ENV.enableIntercom) {
    return console.log("Intercom Disabled");
  }
  const w = window;
  const ic = w.Intercom;

  const l = function() {
    const s = d.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://widget.intercom.io/widget/mbkqc0o1';
    const x = d.getElementsByTagName('script')[0];
    return x.parentNode.insertBefore(s, x);
  };

  if (typeof ic == 'function') {
    ic('reattach_activator');
    return ic('update', intercomSettings);
  } else {
    var d = document;

    var i = function() {
      return i.c(arguments);
    };

    i.q = [];

    i.c = function(args) {
      i.q.push(args);
    };

    w.Intercom = i;
    if (w.attachEvent) {
      return w.attachEvent('onload', l);
    } else {
      return w.addEventListener('load', l, false);
    }
  }
};

export default installIntercom;
