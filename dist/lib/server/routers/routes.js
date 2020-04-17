const {
  getRoutes,
  postRoutes,
  getRoutesOriginDestination,
} = require('../controllers/routes');

const { notFound } = require('../helpers/errors');

module.exports = async function (ctx) {
  const { req, path } = ctx;
  const { method } = req;
  if (!path) {
    // /routes
    if (method === 'GET') return getRoutes(ctx);
    if (method === 'POST') return postRoutes(ctx);
  } else {
    const match = /^([^/]+)\/([^/]+)\/?$/i.exec(path);
    if (match && match[1] && match[2]) {
      // /routes/{origin}/{destination}
      ctx.params = {
        origin: match[1],
        destination: match[2],
      };
      if (method === 'GET') return getRoutesOriginDestination(ctx);
    }
  }
  notFound(ctx);
};
