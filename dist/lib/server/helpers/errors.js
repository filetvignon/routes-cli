function badRequest(ctx, message) {
  const statusCode = 400;
  ctx.response = {
    statusCode,
    body: {
      statusCode,
      message: message || 'Bad request',
    },
  };
}

function methodNowAllowed(ctx, message) {
  const statusCode = 405;
  ctx.response = {
    statusCode,
    body: {
      statusCode,
      message: message || 'Method not allowed',
    },
  };
}

function notFound(ctx, message) {
  const statusCode = 404;
  ctx.response = {
    statusCode,
    body: {
      statusCode,
      message: message || 'Not found',
    },
  };
}

function serverError(ctx, message) {
  const statusCode = 500;
  ctx.response = {
    statusCode,
    body: {
      statusCode,
      message: message || 'Sorry, something went wrong. Please try again later',
    },
  };
}

module.exports = {
  badRequest,
  methodNowAllowed,
  serverError,
  notFound,
};
