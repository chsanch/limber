import EmberRouter from '@ember/routing/router';

import config from 'tutorial/config/environment';

import { properLinks } from 'limber-ui/proper-links';

@properLinks
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('tutorial', { path: '/*tutorial' }, function () {
    this.route('step', { path: '/*step' });
  });
});
