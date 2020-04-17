const Graph = require('../../lib/graph');

describe('Graph', () => {
  const graph = new Graph();

  test.each([
    ['GRU', 'BRC', 10],
    ['BRC', 'SCL', 5],
    ['GRU', 'CDG', 75],
    ['GRU', 'SCL', 20],
    ['GRU', 'ORL', 56],
    ['ORL', 'CDG', 5],
    ['SCL', 'ORL', 20],
  ])('addEdge(%s, %s, %d)', (src, dest, cost) => {
    expect(() => graph.addEdge(src, dest, cost)).not.toThrow();
  });

  test('Cannot add circular edge (from node to the same node)', () => {
    expect(graph.addEdge('src', 'src')).toBeUndefined();
  });

  test('graphmethods', () => {
    expect(graph.getNeighborsWeights('GRU')).toStrictEqual({
      BRC: 10,
      CDG: 75,
      SCL: 20,
      ORL: 56,
    });

    expect(graph.getNeighbors('GRU')).toStrictEqual([
      'BRC',
      'CDG',
      'SCL',
      'ORL',
    ]);

    expect(graph.exists('NONEXISTENT')).toBe(false);
    expect(graph.exists('SCL')).toBe(true);
  });

  // Note: Next test will test both Graph method 'calculateBestRoute'
  // and current algorithm being used (dijkstra)
  test.each([
    [
      'GRU',
      'CDG',
      {
        path: ['GRU', 'BRC', 'SCL', 'ORL', 'CDG'],
        weight: 40,
      },
    ],
    [
      'BRC',
      'CDG',
      {
        path: ['BRC', 'SCL', 'ORL', 'CDG'],
        weight: 30,
      },
    ],
    [
      'ORL',
      'CDG',
      {
        path: ['ORL', 'CDG'],
        weight: 5,
      },
    ],
    [
      'GRU',
      'GRU',
      {
        path: ['GRU', 'GRU'],
        weight: 0,
      },
    ],
  ])('calculateBestRoute(%s, %s)', (src, dest, bestRoute) => {
    expect(graph.calculateBestRoute(src, dest)).toStrictEqual(bestRoute);
  });

  test('calculateBestRoute null', () => {
    expect(graph.calculateBestRoute('CDG', 'NOTEXISTENT')).toBeUndefined();
  });
});
