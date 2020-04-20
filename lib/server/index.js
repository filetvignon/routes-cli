const http = require('http');

const bodyParser = require('./helpers/bodyParser');

const { methodNotAllowed, notFound, serverError } = require('./helpers/errors');

const { routes } = require('./routers');

module.exports = class Server {
  constructor(graph, opts = {}) {
    const { host = 'localhost', port = 3000 } = opts;
    this.graph = graph;
    this.host = host;
    this.port = port;
    this.allowedMethods = ['GET', 'POST'];
    this.httpServer = http.createServer((req, res) => this.router(req, res));
  }

  async router(req, res) {
    const ctx = {
      req,
      res,
      graph: this.graph,
      response: {},
    };
    try {
      // Check for disallowed methods
      if (!this.allowedMethods.includes(req.method))
        return methodNotAllowed(ctx);

      // Build a new URL object to properly parse request's url path
      const url = new URL(req.url, `http://${req.headers.host}`);

      // Only parse body if not performing a GET
      if (req.method !== 'GET') ctx.body = await bodyParser(req);

      // Check for /routes path
      const matchRoutes = /^\/routes\/?(.*)$/i.exec(url.pathname);
      if (matchRoutes) {
        ctx.path = matchRoutes[1];
        return await routes(ctx);
      }

      // no path found
      notFound(ctx);
    } catch (err) {
      serverError(ctx, err.message);
    } finally {
      let headers = { Date: new Date().toUTCString() };
      let { statusCode = 200, body } = ctx.response;
      if (body) {
        try {
          body = JSON.stringify(body);
        } catch (err) {
          statusCode = 502;
          body = JSON.Stringify({
            statusCode,
            message: 'Bad response from server',
          });
        } finally {
          headers = {
            ...headers,
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Language': 'en',
          };
        }
      }
      res.writeHead(statusCode, headers);
      res.end(body);
    }
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.port, this.host, (err) => {
        if (err) return reject(err);
        return resolve(`http://${this.host}:${this.port}`);
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.httpServer.close((err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
};
