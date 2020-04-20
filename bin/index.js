#!/usr/bin/env node

const Cli = require('../lib/cli');
const Server = require('../lib/server');

const { csvToGraph, graphToCsv } = require('../lib/parsers');

const filePath = process.argv[2];

async function run() {
  if (!filePath) {
    console.error(
      'A file path is required to load data.\nUsage:\n> routes-cli <input-file-path>\nExample:\n> routes-cli input-examples.txt'
    );
    return;
  }
  const graph = await csvToGraph(filePath);

  const cli = new Cli(graph);
  const server = new Server(graph);

  const url = await server.start();
  console.log(`** Server running at ${url} **`);

  cli.onInterrupt(async () => {
    console.log(`\n\n** Closing server **`);
    await server.close();
    await graphToCsv(graph, filePath);
    graph.close();
    cli.close();
  });

  cli.start();
}

run().catch(console.error);
