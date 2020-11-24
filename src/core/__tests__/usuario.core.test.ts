
import usuarioCore from '@src/core/usuario.core';
import autorizacaoService from '@src/services/autorizacao.service';

import { ObjectId } from 'mongodb';
import seed from '@test/seed';
import repositorio from '@src/repositorio';
import { IUsuario } from '@src/models/usuario.model';
import testeUtils from '@src/utils/teste.utils';

let idUsuario: string | ObjectId;

afterAll(() => {
  repositorio.desconectar();
});

describe('Testes módulo de usuários', () => {

  it('Deve validar os dados de usuário com sucesso.', async () => {
    const usuario: IUsuario = {
      ...seed.usuarioPadrao,
      senha: await autorizacaoService.criptografarSenha('12345'),
    };

    const resultado = usuarioCore.validarDadosUsuario(usuario)
    expect(resultado.eValido).toBeTruthy()

  });

  it('Deve inserir um novo usuário com sucesso', async () => {
    const usuario: IUsuario = {
      ...seed.usuarioPadrao,
      senha: await autorizacaoService.criptografarSenha('12345'),
    };
    const resultado = await usuarioCore.salvarUsuario(usuario);

    idUsuario = resultado.idIncluido || '';
    expect(resultado.sucesso).toBeTruthy();
  });

  it('Deve obter um usuário por Id', async () => {
    const usuarios = await usuarioCore.listarUsuarios()
    const usuarioCadastrado = testeUtils.obterItemAleatorioDeUmaLista(usuarios)

    const usuario = await usuarioCore.obterUsuarioPorId(usuarioCadastrado._id)

    expect(String(usuario._id)).toEqual(String(usuarioCadastrado._id));
  });

  it('Deve retornar nulo ao tentar obter um usuário por Id inexistente', async () => {
    const usuario = await usuarioCore.obterUsuarioPorId(
      '5f651cd96583125d5370876a'
    );
    expect(usuario).toBeNull();
  });

  it('Deve retornar nulo ao tentar obter um usuário por Id inválido', async () => {
    try {
      await usuarioCore.obterUsuarioPorId('id inválido');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('Deve obter um usuário por documento', async () => {
    const usuario = await usuarioCore.obterUsuarioPorDocumento(12345678900);
    expect(usuario.documento).toEqual(12345678900);
  });

  it('Deve retornar null ao tentar obter um usuário por documento não cadastrado', async () => {
    const usuario = await usuarioCore.obterUsuarioPorDocumento(99999);
    expect(usuario).toBeNull();
  });

  it('Deve obter um usuário por e-mail', async () => {
    const usuario = await usuarioCore.obterUsuarioPorEmail(
      'teste@teste.com.br'
    );
    expect(usuario.email).toEqual('teste@teste.com.br');
  });

  it('Deve retornar null ao tentar obter um usuário por e-mail não cadastrado', async () => {
    const usuario = await usuarioCore.obterUsuarioPorEmail(
      'email@naocadastrado.com'
    );
    expect(usuario).toBeNull();
  });

  it('Deve retornar uma lista de usuários cadastrados', async () => {
    const listarUsuarios = await usuarioCore.listarUsuarios();
    expect(listarUsuarios.length).toBeGreaterThan(0);
  });

  it('Deve retornar uma lista vazia de usuários cadastrados', async () => {
    const listarUsuarios = await usuarioCore.listarUsuarios({
      email: 'email@naocadastrado.com',
    });
    expect(listarUsuarios.length).toEqual(0);
  });

  it('Deve retornar a quantidade de usuários cadastrados', async () => {
    const qtdUsuarios = await usuarioCore.obterQuantidadeUsuarios();
    expect(qtdUsuarios).toBeGreaterThan(0);
  });

  it('Deve fazer login do usuário com sucesso e decodificar token de sessão', async () => {
    const resultadoLogin = await usuarioCore.fazerLogin(
      'teste@teste.com.br',
      '12345'
    );

    expect(resultadoLogin.codigo).toEqual(0);
    expect(resultadoLogin.tokenSessao?.length).toBeGreaterThan(0);

    const dadosToken = usuarioCore.decodificarToken(
      resultadoLogin.tokenSessao || ''
    );

    expect(dadosToken.email).toEqual('teste@teste.com.br');
  });

  it('Deve recusar login do usuário por senha inválida', async () => {
    const resultadoLogin = await usuarioCore.fazerLogin(
      'teste@teste.com.br',
      '12345-errada'
    );

    expect(resultadoLogin.codigo).toEqual(2);
  });

  it('Deve recusar login do usuário por usuário inexistente', async () => {
    const resultadoLogin = await usuarioCore.fazerLogin(
      'nao@existe.com.br',
      '12345'
    );

    expect(resultadoLogin.codigo).toEqual(1);
  });
});
