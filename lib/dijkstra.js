const { parentPort } = require('worker_threads');

const PriorityQueue = require('./priorityQueue');

parentPort.on('message', ({ connections = {}, source, target }) => {
  const queue = new PriorityQueue();

  const weightSum = {};
  const previousNode = {};

  weightSum[source] = 0;
  queue.enqueue(0, source);

  let done = false;

  while (!done && !queue.isEmpty()) {
    const currentNode = queue.dequeue();

    if (currentNode === target) done = true;
    else {
      for (const node of Object.keys(connections[currentNode]))
        if (!weightSum[node]) weightSum[node] = Infinity;

      for (const [node, weight] of Object.entries(connections[currentNode])) {
        const sum = weightSum[currentNode] + weight;
        if (sum < weightSum[node]) {
          weightSum[node] = sum;
          previousNode[node] = currentNode;
          queue.enqueue(sum, node);
        }
      }
    }
  }

  const weight = weightSum[target];

  if (!weight) return parentPort.postMessage();

  const path = [target];
  let lastStep = target;

  while (lastStep !== source) {
    path.unshift(previousNode[lastStep]);
    lastStep = previousNode[lastStep];
  }

  const response = {
    path,
    weight,
  };

  parentPort.postMessage(response);
});
