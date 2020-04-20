// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');

const Server = require('../../lib/server');
const { csvToGraph } = require('../../lib/parsers');

jest.mock('../../lib/parsers');

let graph;
let server;

beforeAll(() => {
  graph = csvToGraph();
  server = new Server(graph);
});

afterAll(() => {
  graph.close();
});

test('Start and close server', async () => {
  expect(await server.start()).toBe('http://localhost:3000');
  expect(async () => await server.close()).not.toThrow();
});

describe('Endpoints', () => {
  beforeEach(async () => {
    await server.start();
  });

  afterEach(async () => {
    await server.close();
  });

  test('GET /routes/gru/cdg', async () => {
    const res = await request(server.httpServer).get('/routes/gru/cdg').send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toStrictEqual({
      origin: 'GRU',
      destination: 'CDG',
      route: 'GRU - BRC - SCL - ORL - CDG',
      cost: 40,
    });
  });

  test('Bad Request GET /routes/gru/NONEXISTENT', async () => {
    const res = await request(server.httpServer)
      .get('/routes/gru/NONEXISTENT')
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toStrictEqual({
      statusCode: 400,
      message: 'NONEXISTENT is not a valid destination',
    });
  });

  test('POST JSON /routes', async () => {
    const res = await request(server.httpServer).post('/routes').send({
      origin: 'origin',
      destination: 'destination',
      cost: 999,
    });
    expect(res.statusCode).toBe(204);
  });

  test('Bad Request POST JSON /routes', async () => {
    const res = await request(server.httpServer).post('/routes').send({
      origin: 'origin',
      destination: 'destination',
      cost: 'String',
    });
    expect(res.statusCode).toBe(400);
  });

  test('POST CSV /routes', async () => {
    const res = await request(server.httpServer)
      .post('/routes')
      .set('content-type', 'text/csv')
      .send(`gru, cdg, 80\ncdg, orl, 99\norigin, DESTINATION2, 999.999`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /routes', async () => {
    const res = await request(server.httpServer).get('/routes').send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toStrictEqual({
      ORL: {
        CDG: 5,
      },
      SCL: {
        ORL: 20,
      },
      BRC: {
        SCL: 5,
      },
      GRU: {
        BRC: 10,
        CDG: 80,
        SCL: 20,
        ORL: 56,
      },
      CDG: {
        ORL: 99,
      },
      ORIGIN: {
        DESTINATION: 999,
        DESTINATION2: 999.999,
      },
      DESTINATION: {},
      DESTINATION2: {},
    });
  });
});
