describe('Teste funcional API', () => {
  const tokenAcesso = 'b0339adc-2384-4894-907f-965a62433ac9';

  it('Deve verificar o status da API', async () => {
    const { body, statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: '/api/status',
      headers: { 'x-access-token': tokenAcesso },
    });

    expect(statusCode).toBe(200);
    expect(JSON.parse(body)).toEqual({
      dados: {
        status: 'API está funcionando! :D',
      },
      status: {
        cod: 200,
        descricao: 'OK',
      },
    });
  });

  it('Deve retornar erro de não autorizado por token não informado', async () => {
    const { body, statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: '/api/status',
    });

    expect(statusCode).toBe(400);
    expect(JSON.parse(body)).toEqual({
      dados: {
        erro: {
          codigo: 1002,
          descricao: '[APLICACAO] Token de acesso inválido ou não informado.',
        },
      },
      status: {
        cod: 400,
        descricao: 'BAD_REQUEST',
      },
    });
  });
});
