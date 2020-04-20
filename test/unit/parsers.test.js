const { csvToGraph, graphToCsv } = require('../../lib/parsers');
const inputFilePath = 'test/files/input.txt';
const outputFilePath = 'test/files/output.txt';

// Test parsing in both directions
test('csvToGraph and graphToCsv parsers', async () => {
  const graph = await csvToGraph(inputFilePath);
  expect(graph).toBeDefined();
  graph.addEdge('newSource', 'newDestination', 9999.99);
  await graphToCsv(graph, outputFilePath);
  const newGraph = await csvToGraph(outputFilePath);
  expect(newGraph).toStrictEqual(graph);
});
