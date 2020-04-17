const Graph = require('../../lib/graph');

module.exports = () => {
  const graph = new Graph();
  graph.addEdge('GRU', 'BRC', 10);
  graph.addEdge('BRC', 'SCL', 5);
  graph.addEdge('GRU', 'CDG', 75);
  graph.addEdge('GRU', 'SCL', 20);
  graph.addEdge('GRU', 'ORL', 56);
  graph.addEdge('ORL', 'CDG', 5);
  graph.addEdge('SCL', 'ORL', 20);
  return graph;
};
