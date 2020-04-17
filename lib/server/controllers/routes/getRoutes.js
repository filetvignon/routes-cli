module.exports = function (ctx) {
  const { graph } = ctx;
  ctx.response = {
    statusCode: 200,
    body: graph.nodes,
  };
};
