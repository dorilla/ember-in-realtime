/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-in-realtime',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'font-src': "'self' http://code.ionicframework.com http://fonts.gstatic.com",
    'connect-src': "'self' http://localhost:1337 ws://localhost:1337",
    'img-src': "'self'",
    'style-src': "'self' 'unsafe-inline' http://fonts.gstatic.com http://fonts.googleapis.com http://code.ionicframework.com",
    'media-src': "'self'"
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
