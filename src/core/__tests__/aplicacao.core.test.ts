import aplicacaoCore from '../aplicacao.core';
import repositorio from '@src/repositorio';
import seed from '@test/seed';

afterAll(() => {
  repositorio.desconectar();
});

describe('Teste módulo aplicação', () => {
  it('Deve retornar sucesso ao validar os dados de uma aplicação', () => {
    const validacao = aplicacaoCore.validarDadosAplicacao(seed.aplicaoPadrao);
    expect(validacao.eValido).toBeTruthy();
  });

  it('Deve retornar erro ao validar os dados de uma aplicação', () => {
    const validacao = aplicacaoCore.validarDadosAplicacao({ ...seed.aplicaoPadrao, tipo: 'WE' });
    expect(validacao.eValido).toBeFalsy();
  });

  it('Deve salvar uma nova aplicação no banco de dados', async () => {
    const resultado = await aplicacaoCore.salvarAplicacao(seed.aplicaoPadrao);
    expect(resultado.sucesso).toBeTruthy();
  });

  it('Deve recuperar uma aplicação pelo id e pelo token de acesso', async () => {
    const aplicacaoCadastrada = await aplicacaoCore.obterAplicacaoPorTokenAcesso(
      seed.aplicaoPadrao.tokenAcesso
    );

    const aplicacaoRecuperadaPorId = await aplicacaoCore.obterAplicacaoPorId(
      String(aplicacaoCadastrada._id)
    );

    expect(aplicacaoCadastrada._id).toEqual(aplicacaoRecuperadaPorId._id);
  });

  it('Deve retornar erro ao tentar recupear uma aplicação com id inválido.', async () => {
    try {
      await aplicacaoCore.obterAplicacaoPorId('id inválido');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('Deve retornar null ao tentar recupear uma aplicação com id inexistente.', async () => {
    const aplicacaoCadastrada = await aplicacaoCore.obterAplicacaoPorId(
      '5f63b4f7a8c062c66a583e90'
    );
    expect(aplicacaoCadastrada).toBeNull();
  });

  it('Deve retornar null ao tentar recupear uma aplicação com token de acesso inválido.', async () => {
    const aplicacaoCadastrada = await aplicacaoCore.obterAplicacaoPorTokenAcesso(
      'token inválido'
    );

    expect(aplicacaoCadastrada).toBeNull();
  });

  it('Deve recuperar uma lista de aplicações do emissor 0', async () => {
    const listaDeAplicacoes = await aplicacaoCore.obterAplicacoesPorEmissor(0);
    expect(listaDeAplicacoes.length).toBeGreaterThan(0);
  });

  it('Deve recuperar uma lista vazia de aplicações do emissor 1', async () => {
    const listaDeAplicacoes = await aplicacaoCore.obterAplicacoesPorEmissor(1);
    expect(listaDeAplicacoes.length).toEqual(0);
  });
});
