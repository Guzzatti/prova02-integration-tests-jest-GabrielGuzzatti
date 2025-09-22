import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('JSONPlaceholder API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  p.request.setDefaultTimeout(60000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Posts', () => {
    it('GET /posts deve retornar lista de posts', async () => {
      await p
        .spec()
        .get(`${baseUrl}/posts`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([{ id: 1 }])
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              userId: { type: 'integer' },
              title: { type: 'string' },
              body: { type: 'string' },
            },
            required: ['id', 'userId', 'title', 'body'],
          },
        });
    });
  });
});
