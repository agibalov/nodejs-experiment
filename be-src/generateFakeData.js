var co = require('co');

module.exports = function(Q, Person, Team, faker) {
  var NUMBER_OF_PEOPLE = 30;
  var NUMBER_OF_TEAMS = 10;
  var MIN_TEAM_SIZE = 0;
  var MAX_TEAM_SIZE = 10;

  var ROLES = [
    'Developer',
    'QA',
    'Manager',
    'Designer'
  ];

  return function() {
    co(function* () {
      var personIds = [];
      for(var i = 0; i < NUMBER_OF_PEOPLE; ++i) {
        var person = yield Person.create({
          name: faker.name.findName()
        });
        personIds.push(person.id);
      }

      var teamIds = [];
      for(var i = 0; i < NUMBER_OF_TEAMS; ++i) {
        var team = yield Team.create({
          name: faker.company.companyName()
        });
        teamIds.push(team.id);
      }

      for(var i = 0; i < teamIds.length; ++i) {
        var teamId = teamIds[i];
        var teamCandidateIds = personIds.slice(0);
        var teamSize = Math.floor(MIN_TEAM_SIZE + Math.random() * (MAX_TEAM_SIZE - MIN_TEAM_SIZE));

        var team = yield Team.find(teamId);
        for(var j = 0; j < teamSize; ++j) {
          var randomCandidateIndex = Math.floor(Math.random() * teamCandidateIds.length);
          var personId = teamCandidateIds[randomCandidateIndex];
          var person = yield Person.find(personId);

          var randomRoleIndex = Math.floor(Math.random() * roles.length);
          var role = roles[randomRoleIndex];

          yield team.addMember(person, { role: role });
          teamCandidateIds.splice(randomCandidateIndex, 1);
        }
      }
    });
  };
};
