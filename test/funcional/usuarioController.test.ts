import moment from 'moment';
import { IUsuario, STATUS_USUARIO } from '@src/models/usuario.model';
import usuarioCore from '@src/core/usuario.core';
import seed from '@test/seed';

describe('Teste funcional API usuários', () => {
  let usuarioCadastrado: IUsuario;
  const tokenAcesso = 'b0339adc-2384-4894-907f-965a62433ac9';
  let tokenSessao = '';

  it('Deve verificar o status da API de Usuários', async () => {
    const { body, statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: '/usuarios/api/status',
      headers: { 'x-access-token': tokenAcesso },
    });

    expect(statusCode).toEqual(200);
    expect(JSON.parse(body)).toEqual({
      dados: {
        status: 'API de USUARIOS está funcionando!!',
      },
      status: {
        cod: 200,
        descricao: 'OK',
      },
    });
  });

  it('Deve fazer login com sucesso', async () => {
    const { body, statusCode } = await global.apiTeste.inject({
      method: 'POST',
      url: '/usuarios/login',
      headers: { 'x-access-token': tokenAcesso },
      payload: { nomeUsuario: seed.usuarioPadrao.email, senha: '12345' },
    });

    const dados = JSON.parse(body).dados;
    tokenSessao = dados.tokenSessao;
    expect(statusCode).toEqual(200);
  });

  it('Deve retornar erro ao tentar cadastrar usuário com e-mail existente', async () => {
    const { statusCode } = await global.apiTeste.inject({
      method: 'POST',
      url: '/usuarios',
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
      payload: seed.usuarioPadrao,
    });

    expect(statusCode).toEqual(409);
  });

  it('Deve retornar erro ao tentar cadastrar usuário com documento existente', async () => {
    const usuario = { ...seed.usuarioPadrao };
    usuario.email = `${moment().valueOf()}@teste.com.br`;

    const { statusCode } = await global.apiTeste.inject({
      method: 'POST',
      url: '/usuarios',
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
      payload: seed.usuarioPadrao,
    });

    expect(statusCode).toEqual(409);
  });

  it('Deve cadastrar um usuário com sucesso', async () => {
    const dadosUsuario = { ...(await seed.gerarUsuarioValido()) };
    const { body, statusCode } = await global.apiTeste.inject({
      method: 'POST',
      url: '/usuarios',
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
      payload: dadosUsuario,
    });

    usuarioCadastrado = JSON.parse(body).dados.usuario;

    expect(statusCode).toEqual(201);
  });

  it('Deve atualizar um usuário com sucesso', async () => {
    const dadosUsuario = await usuarioCore.obterUsuarioPorEmail(
      seed.usuarioPadrao.email
    );
    dadosUsuario.nome = 'Nome Atualizado No Teste Funcional';
    dadosUsuario.status = STATUS_USUARIO.ATIVO;

    const { statusCode } = await global.apiTeste.inject({
      method: 'PUT',
      url: `/usuarios/${dadosUsuario._id}`,
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
      payload: dadosUsuario,
    });

    expect(statusCode).toEqual(200);
  });

  it('Deve retornar erro ao tentar atualizar um usuário com documento já cadastrado', async () => {
    const dadosUsuario = await usuarioCore.obterUsuarioPorEmail(
      seed.usuarioPadrao.email
    );
    dadosUsuario.email = `${moment().valueOf()}@teste.com.br`;
    dadosUsuario.documento = usuarioCadastrado.documento;

    const { statusCode } = await global.apiTeste.inject({
      method: 'PUT',
      url: `/usuarios/${dadosUsuario._id}`,
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
      payload: dadosUsuario,
    });

    expect(statusCode).toEqual(403);
  });

  it('Deve retornar uma lista de usuários cadastrados', async () => {
    const { body, statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: `/usuarios`,
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
    });

    const dados = JSON.parse(body).dados;

    expect(dados.usuarios.length).toBeGreaterThan(0);
    expect(statusCode).toEqual(200);
  });

  it('Deve enviar um e-mail de ativação de cadastro com sucesso.', async () => {
    const { statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: `/usuarios/ativacao/enviar-email/${usuarioCadastrado.email}`,
      headers: {
        'x-access-token': tokenAcesso,
      },
    });

    expect(statusCode).toEqual(200);
  });

  it('Deve ativar cadastro do usuário', async () => {
    const tokenAtivacao = usuarioCore.gerarTokenUsuario(
      usuarioCadastrado._id || '',
      usuarioCadastrado.email,
      usuarioCadastrado.documento
    );

    const { statusCode } = await global.apiTeste.inject({
      method: 'POST',
      url: `/usuarios/ativacao-cadastro`,
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
      payload: { tokenAtivacao },
    });

    expect(statusCode).toEqual(200);
  });

  it('Deve retornar erro ao enviar um e-mail de ativação de cadastro para usuário ativo.', async () => {
    const { statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: `/usuarios/ativacao/enviar-email/${seed.usuarioPadrao.email}`,
      headers: {
        'x-access-token': tokenAcesso,
      },
    });

    expect(statusCode).toEqual(400);
  });

  it('Deve retornar um usuário por id.', async () => {
    const usuario = await usuarioCore.obterUsuarioPorEmail(
      seed.usuarioPadrao.email
    );

    const { body, statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: `/usuarios/${usuario._id}`,
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
    });

    const dados = JSON.parse(body).dados;
    expect(statusCode).toEqual(200);
    expect(dados.usuario._id).toEqual(String(usuario._id));
  });

  it('Deve retornar erro ao tentar obter um usuário por id inexistente.', async () => {
    const { statusCode } = await global.apiTeste.inject({
      method: 'GET',
      url: `/usuarios/5f6532bf6583125d53708c00`,
      headers: {
        'x-access-token': tokenAcesso,
        'x-token-session': tokenSessao,
      },
    });

    expect(statusCode).toEqual(404);
  });
});
