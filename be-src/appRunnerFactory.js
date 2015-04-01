var path = require('path');

module.exports = function(settings) {
  var container = {
    values: {
      Q: require('q'),
      enableDestroy: require('server-destroy'),
      Sequelize: require('sequelize'),
      koa: require('koa'),
      koaStatic: require('koa-static'),
      KoaRouter: require('koa-router'),
      koaBodyParser: require('koa-body-parser'),
      koaCompose: require('koa-compose'),
      koaSend: require('koa-send'),
      koaMount: require('koa-mount'),
      RESTError: require('./api/restError'),

      staticRootPath: path.resolve(__dirname, '../fe-build/'),
      indexHtmlPath: path.resolve(__dirname, '../fe-build/index.html'),
      indexLocations: ['/', '/teams', '/people'],
      staticRootLocation: '/',
      apiRootLocation: '/api',

      serverPort: (settings && settings.serverPort) || 3000,
      connectionString: (settings && settings.connectionString) || 'sqlite://my.db',
      dummyMessage: (settings && settings.dummyMessage) || 'hello there'
    },
    factories: {
      // DATA CONTEXT
      sequelize: require('./models/sequelize'),
      dataContext: require('./models/dataContext'),
      Team: require('./models/team'),
      Person: require('./models/person'),
      Membership: require('./models/membership'),
      TeamMembersRelation: require('./models/teamMembersRelation'),
      PersonMembershipsRelation: require('./models/personMembershipsRelation'),

      // STATIC RESOURCES
      staticMiddleware: require('./static/middleware.js'),

      // API RESOURCES
      responseMethodsMiddleware: require('./api/responseMethodsMiddleware'),
      transactionalMiddleware: require('./api/transactionalMiddleware'),
      apiMiddleware: require('./api/middleware'),
      personIdParam: require('./api/routes/personIdParam'),
      createPersonRoute: require('./api/routes/createPerson'),
      getPersonRoute: require('./api/routes/getPerson'),

      // KOA APPLICATION
      app: require('./app'),
      appRunner: require('./appRunner')
    }
  };

  return require('hinoki').get(container, 'appRunner');
};
