const { badRequest } = require('../../helpers/errors');

module.exports = function (ctx) {
  const { graph, req, body } = ctx;
  if (/text\/(csv|plain)/.test(req.headers['content-type'])) {
    const lines = body.split('\n');
    for (const line of lines) {
      let [origin, destination, cost = 0] = line.split(/\s*,\s*/);
      if (!origin) return badRequest(ctx, 'Origin cannot be empty');
      if (!destination) return badRequest(ctx, 'Destination cannot be empty');
      if (isNaN(cost)) return badRequest(ctx, 'Invalid value for route cost');
      origin = origin.toUpperCase();
      destination = destination.toUpperCase();
      cost = Number(cost);
      graph.addEdge(origin, destination, cost);
    }
  } else {
    let { origin, destination, cost = 0 } = JSON.parse(body);
    if (typeof origin !== 'string')
      return badRequest(ctx, 'Origin must be a string');
    if (typeof destination !== 'string')
      return badRequest(ctx, 'Destination must be a string');
    if (isNaN(cost)) return badRequest(ctx, 'Invalid value for route cost');
    origin = origin.trim().toUpperCase();
    destination = destination.trim().toUpperCase();
    cost = Number(cost);
    if (!origin) return badRequest(ctx, 'Origin cannot be empty');
    if (!destination) return badRequest(ctx, 'Destination cannot be empty');
    if (origin === destination)
      return badRequest(ctx, 'Destination cannot be the same as origin');
    graph.addEdge(origin, destination, cost);
  }
  ctx.response = {
    statusCode: 204,
  };
};
