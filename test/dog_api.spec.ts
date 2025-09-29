import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Dog API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.thedogapi.com/v1';
  const apiKey = 'live_IUaoiuMb4ffZjuflDttSR1IAy3EmcydBlaxsH9AhXBFhlgRkA16NwNJOBBx0w0Dw';

  let imageId = '';
  let voteId = 0;
  let favouriteId = 0;

  p.request.setDefaultTimeout(60000);

  beforeAll(async () => {
    p.reporter.add(rep);
    imageId = await p
      .spec()
      .get(`${baseUrl}/images/search`)
      .withHeaders('x-api-key', apiKey)
      .withQueryParams({ limit: 1, has_breeds: 1 })
      .expectStatus(StatusCodes.OK)
      .returns('[0].id');
  });

  afterAll(() => p.reporter.end());

  describe('Dogs', () => {
    it('GET /breeds deve retornar lista de raças de cães', async () => {
      await p
        .spec()
        .get(`${baseUrl}/breeds`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' }
            },
            required: ['id', 'name']
          }
        });
    });

    it('GET /breeds com limit=5', async () => {
      await p
        .spec()
        .get(`${baseUrl}/breeds`)
        .withHeaders('x-api-key', apiKey)
        .withQueryParams('limit', 5)
        .expectStatus(StatusCodes.OK)
        .expectJsonLength(5);
    });

    it('GET /breeds/search?q=terrier', async () => {
      await p
        .spec()
        .get(`${baseUrl}/breeds/search`)
        .withHeaders('x-api-key', apiKey)
        .withQueryParams('q', 'terrier')
        .expectStatus(StatusCodes.OK)
        .expectBodyContains('Terrier');
    });

    it('GET /images/search retorna url', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images/search`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              url: { type: 'string' }
            },
            required: ['id', 'url']
          }
        });
    });

    it('GET /images/search com filtros e limit=3', async () => {
      await p
        .spec()
        .get(`${baseUrl}/images/search`)
        .withHeaders('x-api-key', apiKey)
        .withQueryParams({ limit: 3, has_breeds: 1, mime_types: 'jpg,png' })
        .expectStatus(StatusCodes.OK)
        .expectJsonLength(3)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              url: { type: 'string' }
            },
            required: ['id', 'url']
          }
        });
    });

    it('POST /votes cria voto', async () => {
      voteId = await p
        .spec()
        .post(`${baseUrl}/votes`)
        .withHeaders('x-api-key', apiKey)
        .withJson({ image_id: imageId, value: 1, sub_id: 'guzzatti-tests' })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({ message: 'SUCCESS' })
        .returns('id');
    });

    it('GET /votes lista votos', async () => {
      await p
        .spec()
        .get(`${baseUrl}/votes`)
        .withHeaders('x-api-key', apiKey)
        .withQueryParams({ sub_id: 'guzzatti-tests', limit: 10 })
        .expectStatus(StatusCodes.OK);
    });

    it('DELETE /votes/{id} apaga voto', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/votes/${voteId}`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ message: 'SUCCESS' });
    });

    it('POST /favourites cria favorito', async () => {
      favouriteId = await p
        .spec()
        .post(`${baseUrl}/favourites`)
        .withHeaders('x-api-key', apiKey)
        .withJson({ image_id: imageId, sub_id: 'guzzatti-tests' })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ message: 'SUCCESS' })
        .returns('id');
    });

    it('DELETE /favourites/{id} apaga favorito', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/favourites/${favouriteId}`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ message: 'SUCCESS' });
    });
  });
});
