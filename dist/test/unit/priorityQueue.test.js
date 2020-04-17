const PriorityQueue = require('../../lib/priorityQueue');

test('PriorityQueue', () => {
  const pQueue = new PriorityQueue();
  expect(pQueue).toBeDefined();
  expect(pQueue.length).toBe(0);
  pQueue.enqueue(10, 'item1');
  expect(pQueue.length).toBe(1);
  pQueue.enqueue(0, 'item2');
  pQueue.enqueue(100, 'item3');
  expect(pQueue.length).toBe(3);

  let minValue = pQueue.dequeue();
  expect(minValue).toBe('item2');
  expect(pQueue.length).toBe(2);

  minValue = pQueue.dequeue();
  expect(minValue).toBe('item1');
  expect(pQueue.length).toBe(1);

  minValue = pQueue.dequeue();
  expect(minValue).toBe('item3');
  expect(pQueue.length).toBe(0);

  minValue = pQueue.dequeue();
  expect(minValue).toBeUndefined();
  expect(pQueue.length).toBe(0);
});
