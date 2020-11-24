import usuarioCore from '@src/core/usuario.core';
import {
  ERROS_USUARIO,
  IUsuario,
  RESULTADO_LOGIN,
  STATUS_USUARIO,
} from '@src/models/usuario.model';
import autorizacaoService, {
  TEMPO_EXPIRACAO_TOKEN,
} from '@src/services/autorizacao.service';

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import appApi, { HTTP_STATUS } from './apiController';

const recurso = '/usuarios';

interface DadosLogin {
  nomeUsuario: string;
  senha: string;
}

interface ParamsUsuario {
  idUsuario: string;
  tokenAtivacao: string;
  email: string;
}

interface DadosAtivacaoCadastro {
  tokenAtivacao: string;
}

interface DadosAlteracaoSenha {
  tokenAlteracao: string;
  novaSenha: string;
}

interface DadosRecuperacaoSenha {
  tokenRecuperacao: string;
}

function obterStatusApi(request: FastifyRequest, reply: FastifyReply): void {
  appApi.enviarResposta(reply, HTTP_STATUS.OK, {
    status: 'API de USUARIOS está funcionando!!',
  });
}

async function cadastrarUsuario(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const dadosUsuario = request.body as IUsuario;
    dadosUsuario.status = STATUS_USUARIO.PENDENTE_ATIVACAO;
    const validacaoDados = usuarioCore.validarDadosUsuario(dadosUsuario);

    if (!validacaoDados.eValido) {
      const listaErros = validacaoDados.erros.map((erro: any) => {
        return erro.message;
      });

      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: { ...ERROS_USUARIO.DADOS_INVALIDOS, listaErros, dadosUsuario },
      });
      return;
    }

    const usuarioCadastradoComEmail = await usuarioCore.obterUsuarioPorEmail(
      dadosUsuario.email
    );

    if (usuarioCadastradoComEmail) {
      appApi.enviarResposta(reply, HTTP_STATUS.CONFLICT, {
        erro: {
          ...ERROS_USUARIO.USUARIO_JA_CADASTRADO,
          detalhes: 'Já existe usuário cadastrado com o e-mail informado.',
        },
      });
      return;
    }

    const usuarioCadastradoComDocumento = await usuarioCore.obterUsuarioPorDocumento(
      dadosUsuario.documento
    );

    if (usuarioCadastradoComDocumento) {
      appApi.enviarResposta(reply, HTTP_STATUS.CONFLICT, {
        erro: {
          ...ERROS_USUARIO.USUARIO_JA_CADASTRADO,
          detalhes: 'Já existe usuário cadastrado com o documento informado.',
        },
      });
      return;
    }

    const usuarioInclusao = usuarioCore.decodificarToken(
      request.headers['x-token-session'] as string
    );

    const idUsuarioSessao: string = usuarioInclusao.idUsuario;
    dadosUsuario.senha = await autorizacaoService.criptografarSenha(
      dadosUsuario.senha || ''
    );
    const resultado = await usuarioCore.salvarUsuario(dadosUsuario);

    if (!resultado) {
      appApi.enviarResposta(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        erro: { ...ERROS_USUARIO.ERRO_SALVAR_USUARIO },
      });
      return;
    }

    // //enviar e-mail para ativação do cadastro
    // const tokenAtivacacao = usuarioCore.gerarTokenUsuario(
    //   String(resultado.idIncluido),
    //   resultado.documento.email,
    //   resultado.documento.documento,
    //   TEMPO_EXPIRACAO_TOKEN['24_HRS']
    // );

    // try {
    //   emailService.enviarEmailAtivacaoCadastro(
    //     resultado.documento.nome,
    //     tokenAtivacacao,
    //     resultado.documento.email
    //   );
    // } catch (error) {
    //   console.log(error);
    // }

    appApi.enviarResposta(reply, HTTP_STATUS.CREATED, {
      usuario: { ...resultado.documento, _id: resultado.idIncluido },
    });
    return;
  } catch (error) {
    appApi.enviarRespostaErro(
      reply,
      {
        ...ERROS_USUARIO.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao salvar usuário.',
      },
      error
    );
  }
}

async function ativarCadastro(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { tokenAtivacao } = request.body as DadosAtivacaoCadastro;
    if (!tokenAtivacao) {
      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: { ...ERROS_USUARIO.TOKEN_ATIVACAO_NAO_INFORMADO },
      });
      return;
    }

    const dadosToken = await usuarioCore.decodificarToken(tokenAtivacao);

    const usuarioCadastrado = await usuarioCore.obterUsuarioPorId(
      dadosToken.idUsuario
    );

    if (!usuarioCadastrado) {
      appApi.enviarResposta(reply, HTTP_STATUS.FORBIDDEN, {
        erro: { ...ERROS_USUARIO.USUARIO_NAO_ENCONTRADO },
      });
      return;
    }

    usuarioCadastrado.status = STATUS_USUARIO.ATIVO;
    usuarioCadastrado._id = String(usuarioCadastrado._id);

    const resultado = await usuarioCore.salvarUsuario(usuarioCadastrado);

    if (!resultado || !resultado.sucesso) {
      appApi.enviarResposta(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        erro: {
          ...ERROS_USUARIO.ERRO_SALVAR_USUARIO,
          mensagem: 'Erro ao ativar cadastro do usuário.',
          detalhesErro: resultado.detalhesErro,
        },
      });
      return;
    }

    delete usuarioCadastrado.senha;
    appApi.enviarResposta(reply, HTTP_STATUS.OK, {
      usuario: usuarioCadastrado,
    });
  } catch (error) {
    appApi.enviarRespostaErro(
      reply,
      {
        ...ERROS_USUARIO.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao salvar usuário.',
      },
      error
    );
  }
}

async function atualizarUsuario(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { idUsuario } = request.params as ParamsUsuario;
    const dadosUsuario = request.body as IUsuario;

    const usuarioCadastrado = await usuarioCore.obterUsuarioPorId(idUsuario);

    if (!usuarioCadastrado) {
      appApi.enviarResposta(reply, HTTP_STATUS.NOT_FOUND, {
        erro: { ...ERROS_USUARIO.USUARIO_NAO_ENCONTRADO },
      });
      return;
    }

    const validacaoDados = usuarioCore.validarDadosUsuario(dadosUsuario);

    if (!validacaoDados.eValido) {
      const listaDeErros = validacaoDados.erros.map((erro: any) => {
        return erro.message;
      });
      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: { ...ERROS_USUARIO.DADOS_INVALIDOS, detalhesErro: listaDeErros },
      });
      return;
    }

    const usuarioCadastradoComEmail = await usuarioCore.obterUsuarioPorEmail(
      dadosUsuario.email
    );
    const usuarioCasdastradoComDocumento = await usuarioCore.obterUsuarioPorDocumento(
      dadosUsuario.documento
    );

    const idUsuarioCadastrado = String(usuarioCadastrado._id);

    if (usuarioCadastradoComEmail) {
      const idUsuarioCadastradoComEmail = String(usuarioCadastradoComEmail._id);
      if (idUsuarioCadastradoComEmail !== idUsuarioCadastrado) {
        appApi.enviarResposta(reply, HTTP_STATUS.FORBIDDEN, {
          erro: {
            ...ERROS_USUARIO.USUARIO_JA_CADASTRADO,
            mensagem: `Já existe usuário cadastrado com o e-mail "${dadosUsuario.email}"`,
          },
        });
        return;
      }
    }

    if (usuarioCasdastradoComDocumento) {
      const idUsuarioCasdastradoComDocumento = String(
        usuarioCasdastradoComDocumento._id
      );
      if (idUsuarioCasdastradoComDocumento !== idUsuarioCadastrado) {
        appApi.enviarResposta(reply, HTTP_STATUS.FORBIDDEN, {
          erro: {
            ...ERROS_USUARIO.USUARIO_JA_CADASTRADO,
            mensagem: `Já existe usuário cadastrado com o documento "${dadosUsuario.documento}"`,
          },
        });
        return;
      }
    }
    delete dadosUsuario['dataCadastro'];
    delete dadosUsuario['_id'];

    // dadosUsuario['_id'] = String(usuarioCadastrado._id);
    dadosUsuario['senha'] = usuarioCadastrado.senha || undefined;

    const resultado = await usuarioCore.salvarUsuario(dadosUsuario);

    if (!resultado || !resultado.sucesso) {
      console.log(resultado);
      appApi.enviarResposta(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        erro: {
          ...ERROS_USUARIO.ERRO_SALVAR_USUARIO,
          mensagem: 'Erro ao cadastrar usuário',
        },
      });
      return;
    }

    delete dadosUsuario['senha'];
    appApi.enviarResposta(reply, HTTP_STATUS.OK, { usuario: dadosUsuario });
    return;
  } catch (error) {
    appApi.enviarRespostaErro(
      reply,
      {
        ...ERROS_USUARIO.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao atualizar usuário.',
      },
      error
    );
  }
}

async function fazerLogin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { nomeUsuario, senha } = request.body as DadosLogin;

    if (!nomeUsuario || !senha) {
      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        ...ERROS_USUARIO.ERRO_LOGIN,
        mensagem: 'Usuário ou senha não informados',
      });
      return;
    }

    let usuario = await usuarioCore.obterUsuarioPorEmail(nomeUsuario);

    if (!usuario) {
      usuario = await usuarioCore.obterUsuarioPorDocumento(
        parseInt(nomeUsuario)
      );
    }

    if (!usuario) {
      appApi.enviarResposta(reply, HTTP_STATUS.FORBIDDEN, {
        erro: {
          ...ERROS_USUARIO.USUARIO_NAO_ENCONTRADO,
          mensagem: 'Usuário não encontrado',
        },
      });
      return;
    }

    const resultadoLogin = await usuarioCore.fazerLogin(usuario.email, senha);

    if (resultadoLogin.codigo === RESULTADO_LOGIN.LOGIN_OK.codigo) {
      delete usuario.senha;
      appApi.enviarResposta(reply, HTTP_STATUS.OK, {
        usuario,
        tokenSessao: resultadoLogin.tokenSessao,
      });
      return;
    }

    let erroUsuario = ERROS_USUARIO.SENHA_INVALIDA;

    switch (resultadoLogin.codigo) {
      case RESULTADO_LOGIN.SENHA_INVALIDA.codigo:
        erroUsuario = ERROS_USUARIO.SENHA_INVALIDA;
        break;
      case RESULTADO_LOGIN.USUARIO_INEXISTENTE.codigo:
        erroUsuario = ERROS_USUARIO.USUARIO_NAO_ENCONTRADO;
        break;
      case RESULTADO_LOGIN.USUARIO_INATIVO.codigo:
        erroUsuario = ERROS_USUARIO.USUARIO_INATIVO;
        break;
      case RESULTADO_LOGIN.SENHA_EXPIRADA.codigo:
        erroUsuario = ERROS_USUARIO.SENHA_EXPIRADA;
        break;
      case RESULTADO_LOGIN.USUARIO_PENDENTE_ATIVACAO.codigo:
        erroUsuario = ERROS_USUARIO.USUARIO_PENDENTE_ATIVACAO;
        break;
      default:
        erroUsuario = ERROS_USUARIO.ERRO_LOGIN;
        break;
    }

    appApi.enviarResposta(reply, HTTP_STATUS.FORBIDDEN, {
      erro: { ...erroUsuario },
    });
  } catch (error) {
    appApi.enviarRespostaErro(
      reply,
      { ...ERROS_USUARIO.ERRO_LOGIN, mensagem: 'Erro ao fazer login.' },
      error
    );
  }
}

async function alterarSenha(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { tokenAlteracao, novaSenha } = request.body as DadosAlteracaoSenha;

    if (!tokenAlteracao) {
      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: { ...ERROS_USUARIO.TOKEN_ALTERACAO_SENHA_NAO_INFORMADO },
      });
      return;
    }
    let dadosToken: any;
    let usuarioCadastrado: IUsuario;

    try {
      dadosToken = await usuarioCore.decodificarToken(tokenAlteracao);
      usuarioCadastrado = await usuarioCore.obterUsuarioPorId(
        dadosToken.idUsuario
      );
    } catch (error) {
      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: {
          ...ERROS_USUARIO.TOKEN_ALTERACAO_SENHA_NAO_INFORMADO,
          mensagem: error.message,
        },
      });
      return;
    }

    if (!usuarioCadastrado) {
      appApi.enviarResposta(reply, HTTP_STATUS.FORBIDDEN, {
        erro: { ...ERROS_USUARIO.USUARIO_NAO_ENCONTRADO },
      });
      return;
    }

    usuarioCadastrado.senha = await autorizacaoService.criptografarSenha(
      novaSenha
    );
    const resultado = await usuarioCore.salvarUsuario(usuarioCadastrado);

    if (!resultado) {
      appApi.enviarResposta(reply, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        erro: {
          ...ERROS_USUARIO.ERRO_SALVAR_USUARIO,
          mensagem: 'Erro ao alterar senha do usuário.',
        },
      });
      return;
    }

    delete usuarioCadastrado.senha;

    appApi.enviarResposta(reply, HTTP_STATUS.OK, {
      usuario: usuarioCadastrado,
    });
  } catch (error) {
    appApi.enviarRespostaErro(
      reply,
      { ...ERROS_USUARIO.ERRO_LOGIN, mensagem: 'Erro ao alterar senha.' },
      error
    );
  }
}

async function recuperarSenha(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  appApi.enviarResposta(reply, HTTP_STATUS.NOT_FOUND, {
    mensagem: 'Não implementado.',
  });
  return;
}

async function obterUsuarioPorId(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { idUsuario } = request.params as ParamsUsuario;
    if (!idUsuario) {
      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: { ...ERROS_USUARIO.DADOS_INVALIDOS },
      });
      return;
    }

    const usuario = await usuarioCore.obterUsuarioPorId(idUsuario);

    if (!usuario) {
      appApi.enviarResposta(reply, HTTP_STATUS.NOT_FOUND, {
        errro: { ...ERROS_USUARIO.USUARIO_NAO_ENCONTRADO },
      });
      return;
    }

    delete usuario['senha'];

    appApi.enviarResposta(reply, HTTP_STATUS.OK, { usuario });
  } catch (error) {
    console.log(error);
    appApi.enviarRespostaErro(
      reply,
      {
        ...ERROS_USUARIO.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao obter usuário por Id.',
      },
      error
    );
  }
}

async function obterListaUsuarios(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const listaUsuarios = await usuarioCore.listarUsuarios();
    const listaUsuariosSemSenha = listaUsuarios.map((usuario) => {
      delete usuario.senha;
      return usuario;
    });

    appApi.enviarResposta(reply, HTTP_STATUS.OK, {
      usuarios: listaUsuariosSemSenha,
    });
  } catch (error) {
    appApi.enviarRespostaErro(
      reply,
      {
        ...ERROS_USUARIO.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao listar usuários.',
      },
      error
    );
  }
}

async function enviarEmailAtivacaoCadastro(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email } = request.params as ParamsUsuario;
    if (!email) {
      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: { ...ERROS_USUARIO.DADOS_INVALIDOS },
      });
      return;
    }
    const usuarioCadastrado = await usuarioCore.obterUsuarioPorEmail(email);
    if (!usuarioCadastrado) {
      appApi.enviarResposta(reply, HTTP_STATUS.NOT_FOUND, {
        errro: {
          ...ERROS_USUARIO.USUARIO_NAO_ENCONTRADO,
          mensagem: 'Não existe usuário cadastrado com o e-mail',
        },
      });
    }

    if (usuarioCadastrado.status !== STATUS_USUARIO.PENDENTE_ATIVACAO) {
      appApi.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        errro: {
          ...ERROS_USUARIO.USUARIO_JA_ATIVADO,
          mensagem: 'Usuário já foi ativado.',
        },
      });
    }

    // //enviar e-mail para ativação do cadastro
    // const tokenAtivacao = usuarioCore.gerarTokenUsuario(
    //   usuarioCadastrado._id as string,
    //   usuarioCadastrado.email,
    //   usuarioCadastrado.documento,
    //   TEMPO_EXPIRACAO_TOKEN['24_HRS']
    // );

    // try {
    //   await emailService.enviarEmailAtivacaoCadastro(
    //     usuarioCadastrado.nome,
    //     tokenAtivacao,
    //     email
    //   );
    // } catch (error) {
    //   appApi.enviarRespostaErro(
    //     reply,
    //     { ...ERROS_USUARIO.ERRO_EMAIL_ATIVACAO, mensagem: '' },
    //     error
    //   );
    //   return;
    // }

    appApi.enviarResposta(reply, HTTP_STATUS.OK, {});
  } catch (error) {
    appApi.enviarRespostaErro(
      reply,
      {
        ...ERROS_USUARIO.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao listar histórico de atividade.',
      },
      error
    );
  }
}

function registrarRotas(app: FastifyInstance): void {
  app.get(`${recurso}/api/status`, {}, obterStatusApi);

  app.put<{ Params: ParamsUsuario }>(
    `${recurso}/:idUsuario`,
    {
      preHandler: [appApi.validarSessaoUsuario],
    },
    atualizarUsuario
  );

  app.post(
    `${recurso}`,
    {
      preHandler: [appApi.validarSessaoUsuario],
    },
    cadastrarUsuario
  );

  app.post<{ Body: DadosAtivacaoCadastro }>(
    `${recurso}/ativacao-cadastro`,
    {},
    ativarCadastro
  );

  app.post<{ Body: DadosAlteracaoSenha }>(
    `${recurso}/alteracao-senha`,
    {},
    alterarSenha
  );

  app.post(
    `${recurso}/recuperacao-senha/:email`,
    {
      preHandler: [],
    },
    recuperarSenha
  );

  app.get(
    `${recurso}`,
    {
      preHandler: [],
    },
    obterListaUsuarios
  );

  app.get<{ Body: ParamsUsuario }>(
    `${recurso}/:idUsuario`,
    {
      preHandler: [],
    },
    obterUsuarioPorId
  );

  app.post<{ Body: DadosLogin }>(`${recurso}/login`, {}, fazerLogin);

  app.get<{ Body: DadosAtivacaoCadastro }>(
    `${recurso}/ativacao`,
    {},
    ativarCadastro
  );

  app.get(
    `${recurso}/ativacao/enviar-email/:email`,
    {},
    enviarEmailAtivacaoCadastro
  );

  // app.get(`${recurso}/:id/historico_acessos`, {
  //     // beforeHandler: []
  // }, obterHistoricoAcessos)

  //todo:

  //logout
  //enviarEmailRecuperacaoSenha
  //alterarSenha
}

export default {
  registrarRotas,
};
