import moment from 'moment';
import seed from '@test/seed';
import noticiaCore from '@src/core/noticia.core';

describe('Testes funcionais da API de clientes', () => {
  const tokenAcesso = 'b0339adc-2384-4894-907f-965a62433ac9';

  it('Deve retornar o status da API de noticias com sucesso', async () => {
    const { statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: '/noticias/api/status',
      headers: { 'x-access-token': tokenAcesso },
    });

    expect(statusCode).toEqual(200);
  });


  it('Deve retornar uma notícia por codigo', async () => {
    const { statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: `/noticias/codigo/${seed.noticiaPadrao.codigo}`,
      headers: { 'x-access-token': tokenAcesso },
    });

    expect(statusCode).toEqual(200);
  });

  it('Deve retornar não encontrado ao tentar recuperar uma notícia por codigo inexistente', async () => {
    const { statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: '/noticias/codigo/inexistente',
      headers: { 'x-access-token': tokenAcesso },
    });

    expect(statusCode).toEqual(404);
  });


  it('Deve retornar retornar uma lista de noticias com o nome pesquisado', async () => {
    const { body, statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: '/noticias/pesquisa/cacilds',
      headers: { 'x-access-token': tokenAcesso },
    });
    const dadosResposta = JSON.parse(body);
    expect(statusCode).toEqual(200);
    expect(dadosResposta.dados.noticias.length).toBeGreaterThan(0);
  });

  it('Deve retornar retornar uma lista de noticias vazia com o texto pesquisado', async () => {
    const { body, statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: '/noticias/pesquisa/invalido inexistente',
      headers: { 'x-access-token': tokenAcesso },
    });
    const dadosResposta = JSON.parse(body);

    expect(statusCode).toEqual(200);
    expect(dadosResposta.dados.noticias.length).toEqual(0);
  });

  it('Deve retornar retornar uma lista de noticias cadastrados', async () => {
    const dataFimPublicacao = moment().format('YYYY-MM-DD')

    const { body, statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: `/noticias?data_publicacao_ate=${dataFimPublicacao}`,
      headers: { 'x-access-token': tokenAcesso },
    });

    const dadosResposta = JSON.parse(body);

    expect(statusCode).toEqual(200);
    expect(dadosResposta.dados.noticias.length).toBeGreaterThan(0);
  });
});
