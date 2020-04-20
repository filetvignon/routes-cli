const routeCalcAlgorithm = './dijkstra.js';
const path = require('path');
const { Worker } = require('worker_threads');
const WorkerPool = require('./workerPool');

module.exports = class Graph {
  constructor(...nodes) {
    this.nodes = {};
    this.bestRouteCalculatorWorkers = new WorkerPool(routeCalcAlgorithm);

    if (Array.isArray(nodes) && nodes.length > 0)
      for (const node of nodes) this.nodes[node] = {};
  }

  getNeighborsWeights(node) {
    return this.nodes[node];
  }

  getNeighbors(node) {
    if (!this.nodes[node]) return;
    return Object.keys(this.nodes[node]);
  }

  addEdge(src, dest, weight = 0) {
    if (src === dest) return;
    if (!this.nodes[dest]) this.nodes[dest] = {};
    if (!this.nodes[src]) this.nodes[src] = {};
    this.nodes[src][dest] = weight;
  }

  exists(node) {
    if (this.nodes[node]) return true;
    return false;
  }

  async calculateBestRoute(src, dest) {
    if (src === dest)
      return {
        path: [src, dest],
        weight: 0,
      };
    if (!this.nodes[src] || !this.nodes[dest]) return;
    return this.bestRouteCalculatorWorkers.runTask({
      connections: this.nodes,
      source: src,
      target: dest,
    });
  }
};
