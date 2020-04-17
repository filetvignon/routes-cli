const { badRequest } = require('../../helpers/errors');

module.exports = function (ctx) {
  const { graph, params = {} } = ctx;
  let { origin = '', destination = '' } = params;
  origin = origin.trim().toUpperCase();
  destination = destination.trim().toUpperCase();
  if (!origin || !destination)
    return badRequest(ctx, 'Bad url path parameters');
  const bestRoute = graph.calculateBestRoute(origin, destination);
  if (!bestRoute)
    return badRequest(ctx, `Route ${origin}-${destination} is not available`);
  ctx.response = {
    statusCode: 200,
    body: {
      origin,
      destination,
      route: bestRoute.path.join(' - '),
      cost: bestRoute.weight,
    },
  };
};
