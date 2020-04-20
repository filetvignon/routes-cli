const Cli = require('../../lib/cli');
const { csvToGraph } = require('../../lib/parsers');

jest.mock('../../lib/parsers');

let graph;
let cli;

const delay = (dur) => new Promise((resolve) => setTimeout(resolve, dur));

describe('CLI', () => {
  const spy = jest.spyOn(console, 'log');

  beforeAll(async () => {
    await delay(200);
    graph = csvToGraph();
  });

  afterAll(() => {
    graph.close();
  });

  beforeEach(() => {
    cli = new Cli(graph);
    cli.start();
  });

  afterEach(() => {
    cli.close();
    cli = undefined;
  });

  test('gru-cdg', async () => {
    cli.terminal.write('gru-cdg\r');
    await delay(500);
    expect(spy.mock.calls[0]).toEqual([
      'Best route: GRU - BRC - SCL - ORL - CDG > $40.00\n',
    ]);
  });

  test('Bad destination parameter', async () => {
    cli.terminal.write('gru-NONEXISTENT\r');
    await delay(500);
    expect(spy.mock.calls[1]).toEqual([
      'NONEXISTENT is not a valid destination\n',
    ]);
  });
});
