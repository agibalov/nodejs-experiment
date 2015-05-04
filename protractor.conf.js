module.exports = {
  config: {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['e2e-test/**/*.spec.js'],
    multiCapabilities: [{
      browserName: 'chrome'
    }, {
      browserName: 'firefox'
    }],
    maxSessions: 1,
    baseUrl: 'http://localhost:3000/',
    params: {
      apiUrl: 'http://localhost:3000/api/'
    }
  }
};
