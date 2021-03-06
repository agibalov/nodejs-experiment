var multiCapabilities;
if(process.env.TRAVIS) {
  multiCapabilities = [{ browserName: 'firefox' }];
} else {
  multiCapabilities = [{ browserName: 'chrome' }, { browserName: 'firefox' }];
}

module.exports = {
  config: {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    multiCapabilities: multiCapabilities,
    maxSessions: 1,
    suites: {
      general: 'e2e-test/*.spec.js',
      people: 'e2e-test/people/**/*.spec.js',
      teams: 'e2e-test/teams/**/*.spec.js'
    },
    baseUrl: 'http://localhost:3000/',
    onPrepare: function() {
      var TeambuildrClient = require('./be-test/teambuildrClient');
      global.client = new TeambuildrClient('http://localhost:3000/api/');

      global.describeTeambuildr = function(name, suiteFunction) {
        describe(name, function() {
          require('./e2e-test/applyAppRunner')();
          suiteFunction();
        });
      };

      global.await = function(providePromise) {
        protractor.promise.controlFlow().execute(function() {
          return providePromise().then(function() {
            return true;
          });
        });
      };
    }
  }
};
