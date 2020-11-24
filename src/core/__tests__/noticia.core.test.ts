import noticiaCore from '@src/core/noticia.core';
import seed from '@test/seed';
import repositorio from '@src/repositorio';
import testeUtils from '@src/utils/teste.utils';

afterAll(() => {
  repositorio.desconectar();
});

describe('Teste módulo noticias', () => {
  it('Deve retornar sucesso ao validar os dados de uma notícia', () => {
    const validacao = noticiaCore.validarDadosNoticia(
      seed.gerarNoticiaValida()
    );
    if (!validacao.eValido) {
      console.log(validacao.erros);
    }
    expect(validacao.eValido).toBeTruthy();
  });

  it('Deve salvar uma nova notícia no banco de dados', async () => {
    const resultado = await noticiaCore.salvarNoticia(
      seed.gerarNoticiaValida()
    );

    expect(resultado.sucesso).toBeTruthy();
  });

  it('Deve recuperar uma notícia pelo id.', async () => {
    const listaDeNoticias = await noticiaCore.listarNoticias()
    const noticiaCadastrada = testeUtils.obterItemAleatorioDeUmaLista(listaDeNoticias)

    const clienteRecuperadoPorId = await noticiaCore.obterNoticiaPorId(
      String(noticiaCadastrada._id)
    );

    expect(noticiaCadastrada._id).toEqual(clienteRecuperadoPorId._id);
  });

  it('Deve retornar erro ao tentar recupear uma notícia com id inválido.', async () => {
    try {
      await noticiaCore.obterNoticiaPorId('id inválido');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('Deve retornar null ao tentar recupear uma notícia com id inexistente.', async () => {
    const aplicacaoCadastrada = await noticiaCore.obterNoticiaPorId(
      '5f63b4f7a8c062c66a583e90'
    );
    expect(aplicacaoCadastrada).toBeNull();
  });

  it('Deve retornar uma lista de noticias com o texto pesquisado.', async () => {
    const resultadoPesquisa = await noticiaCore.pesquisarNoticias(
      'mussum'
    );
    expect(resultadoPesquisa.length).toBeGreaterThan(0);
  });

  it('Deve retornar uma lista vazia ao pesquisar por um texto inexistente.', async () => {
    const resultadoPesquisa = await noticiaCore.pesquisarNoticias(
      'inexistente inválido'
    );
    expect(resultadoPesquisa.length).toEqual(0);
  });

  it('Deve retornar uma lista das notícias cadastradas.', async () => {
    const listaClientes = await noticiaCore.listarNoticias({}, { nome: 1 }, 10);

    expect(listaClientes.length).toBeGreaterThan(0);
  });
});
