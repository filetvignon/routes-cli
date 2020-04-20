const fs = require('fs');
const path = require('path');
const readline = require('readline');

const Graph = require('./graph');

module.exports.csvToGraph = async function (filePath) {
  const graph = new Graph();
  const stream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: stream,
  });

  try {
    stream.on('error', (err) => {
      throw err;
    });

    let counter = 0;
    for await (const line of rl) {
      counter++;
      const [src, dest, cost = 0] = line.split(/\s*,\s*/);
      if (src && dest) graph.addEdge(src, dest, Number(cost));
      else throw new Error(`Error parsing csv ${filePath} on line ${counter}`);
    }

    return graph;
  } finally {
    rl.close();
    stream.destroy();
  }
};

module.exports.graphToCsv = async function (graph, filePath) {
  const fileName = path.basename(filePath);
  const folder = path.dirname(filePath);
  // To avoid corrupting the file, first write the entire graph to a temp file and then replace the file.
  const tempPath = path.join(folder, '~' + fileName);
  const fileHandle = await fs.promises.open(tempPath, 'w');
  for (const [src, edges] of Object.entries(graph.nodes)) {
    for (const [dest, weight] of Object.entries(edges)) {
      await fileHandle.write(`${src},${dest},${weight}\n`);
    }
  }
  await fileHandle.close();
  await fs.promises.rename(tempPath, filePath);
};
