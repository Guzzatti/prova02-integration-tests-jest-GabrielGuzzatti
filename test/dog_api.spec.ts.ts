import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Dog API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api.thedogapi.com/v1';
  const apiKey = 'live_IUaoiuMb4ffZjuflDttSR1IAy3EmcydBlaxsH9AhXBFhlgRkA16NwNJOBBx0w0Dw';
  p.request.setDefaultTimeout(60000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Dogs', () => {
    it('GET /breeds deve retornar lista de raças de cães', async () => {
      await p
        .spec()
        .get(`${baseUrl}/breeds`)
        .withHeaders('x-api-key', apiKey)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([{ id: 1 }]); 
    });
    });
  });
