const { badRequest } = require('../../helpers/errors');

module.exports = async function (ctx) {
  // params are extracted from router before calling this controller
  const { graph, params = {} } = ctx;
  let { origin = '', destination = '' } = params;

  origin = origin.trim().toUpperCase();
  destination = destination.trim().toUpperCase();

  if (!origin || !destination)
    return badRequest(ctx, 'Bad url path parameters');
  if (!graph.exists(origin))
    return badRequest(ctx, `${origin} is not a valid origin`);
  if (!graph.exists(destination))
    return badRequest(ctx, `${destination} is not a valid destination`);

  const bestRoute = await graph.calculateBestRoute(origin, destination);
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
