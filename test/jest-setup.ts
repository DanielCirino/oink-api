import server from '@src/server';
import supertest from 'supertest';
import seed from './seed';

jest.setTimeout(30000);

beforeAll(async () => {
  const app = await server.iniciarServidor();
  await app.ready();
  global.apiTeste = app;
});

afterAll(async () => {
  try {
    server.finalizarServidor();
    global.apiTeste.close();
    seed.finalizar();
  } catch (error) {
    console.log(error);
  }
});
