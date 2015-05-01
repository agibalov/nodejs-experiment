var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('../be-test/teambuildrClient');

var ViewPersonPage = function() {
  this.edit = element(by.css('.edit'));
  this.delete = element(by.css('.delete'));
  this.name = element(by.css('.name'));
  this.avatar = element(by.css('.avatar img'));

  this.noMemberships = element(by.css('#no-memberships-alert'));
  this.memberships = element(by.css('#got-memberships-container'));
};

describe('ViewPersonPage', function() {
  var appRunner;
  beforeEach(function(done) {
    appRunnerFactory().then(function(runner) {
      appRunner = runner;
      return runner.start().then(function() {
        return runner.reset();
      });
    }).finally(done);
  });

  afterEach(function(done) {
    appRunner.stop().finally(done);
    appRunner = null;
  });

  var viewPersonPage;
  var client;
  beforeEach(function() {
    viewPersonPage = new ViewPersonPage();
    client = new TeambuildrClient('http://localhost:3000/api/');
  });

  describe('when there is no person', function() {
    it('should not be possible to look at it', function() {
      browser.get('/people/123');

      // TODO: refactor - some sort of "404 recognizer"?
      expect(element(by.css('.container h1')).isPresent()).toBe(true);
      expect(element(by.css('.container h1')).getText()).toContain('404');
    });
  });

  describe('when there is a person', function() {
    var personId;
    beforeEach(function() {
      var personDescription = {
        name: 'John',
        avatar: 'http://example.org',
        position: 'Developer',
        city: 'New York',
        state: 'NY',
        phone: '+123456789',
        email: 'john@john.com'
      };

      protractor.promise.controlFlow().execute(function() {
        return client.createPerson(personDescription).then(function(response) {
          personId = response.body.id;
        });
      });
    });

    it('should be possible to look at it', function() {
      browser.get('/people/' + personId);

      // TODO: refactor - some sort of "404 recognizer"?
      // expect(element(by.css('.container h1')).isPresent()).toBe(false);
      expect(viewPersonPage.edit.isPresent()).toBe(true);
      expect(viewPersonPage.delete.isPresent()).toBe(true);
      expect(viewPersonPage.name.isPresent()).toBe(true);
      expect(viewPersonPage.avatar.isPresent()).toBe(true);
      expect(viewPersonPage.noMemberships.isPresent()).toBe(true);
      expect(viewPersonPage.memberships.isPresent()).toBe(false);

      expect(viewPersonPage.name.getText()).toBe('John');
    });
  });
});
