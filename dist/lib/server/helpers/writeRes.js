module.exports = function (res, statusCode, body) {
  let headers = { Date: new Date().toUTCString() };
  if (body)
    headers = {
      ...headers,
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Language': 'en',
    };
  res.writeHead(statusCode, headers);
  res.end(body);
};
