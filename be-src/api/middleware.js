module.exports = function(koaBodyParser, koaCompose, KoaRouter, responseMethodsMiddleware, transactionalMiddleware,
  personIdParam,
  createPersonRoute,
  getPersonRoute,
  getPeopleRoute,
  updatePersonRoute,
  deletePersonRoute,
  teamIdParam,
  createTeamRoute,
  getTeamRoute) {

  var apiRouter = new KoaRouter();
  personIdParam(apiRouter);
  createPersonRoute(apiRouter);
  getPersonRoute(apiRouter);
  getPeopleRoute(apiRouter);
  updatePersonRoute(apiRouter);
  deletePersonRoute(apiRouter);
  teamIdParam(apiRouter);
  createTeamRoute(apiRouter);
  getTeamRoute(apiRouter);

  return koaCompose([
    koaBodyParser(),
    responseMethodsMiddleware,
    transactionalMiddleware,
    // TODO: koaSleep()
    apiRouter.middleware()
  ]);
};
