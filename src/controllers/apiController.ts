import moment from 'moment';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { InterfaceErro } from '@src/utils/erros/erro-interno';
import { ERROS_APLICACAO } from '@src/models/aplicacao.model';
import aplicacaoCore from '@src/core/aplicacao.core';
import { ERROS_USUARIO } from '@src/models/usuario.model';
import usuarioCore from '@src/core/usuario.core';

export enum HTTP_STATUS {
  'OK' = 200,
  'CREATED' = 201,
  'BAD_REQUEST' = 400,
  'UNAUTHORIZED' = 401,
  'FORBIDDEN' = 403,
  'NOT_FOUND' = 404,
  'TOO_MANY_REQUESTS' = 429,
  'INTERNAL_SERVER_ERROR' = 500,
  'CONFLICT' = 409,
}

export interface ErroApi {
  codigo: number;
  mensagem: string;
  descricao?: string;
}

function obterCopyright(): any {
  const anoInicio = '2019';
  const anoAtual =
    moment().format('Y') !== anoInicio ? moment().format(' - Y') : '';
  return {
    ano: `${anoInicio + anoAtual}`,
    app: {
      nome: 'Cards Journal - Services',
      site: 'www.guardian.co',
    },
    versaoApi: '1.0.0',
  };
}

async function validarTokenAcessoApi(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const tokenAcesso = request.headers['x-access-token'] as string;

  if (!tokenAcesso) {
    enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
      erro: ERROS_APLICACAO.TOKEN_ACESSO_INVALIDO,
    });
    return;
  }

  const aplicacao = await aplicacaoCore.obterAplicacaoPorTokenAcesso(
    tokenAcesso
  );

  console.log(aplicacao)

  if (!aplicacao) {
    enviarResposta(
      reply,
      HTTP_STATUS.FORBIDDEN,
      ERROS_APLICACAO.TOKEN_ACESSO_INVALIDO
    );
    return;
  }

  return;
}

async function validarSessaoUsuario(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const tokenSessao = request.headers['x-token-session'] as string;

  if (!tokenSessao) {
    enviarResposta(reply, HTTP_STATUS.UNAUTHORIZED, {
      erro: ERROS_USUARIO.TOKEN_SESSAO_NAO_INFORMADO,
    });
    return;
  }

  try {
    await usuarioCore.decodificarToken(tokenSessao);
  } catch (error) {
    console.log(error);
    enviarResposta(reply, HTTP_STATUS.UNAUTHORIZED, {
      erro: ERROS_USUARIO.TOKEN_SESSAO_NAO_INFORMADO,
    });
    // enviarRespostaErro(
    //   reply,
    //   {
    //     ...ERROS_USUARIO.SESSAO_INVALIDA,
    //     mensagem: 'Erro ao validar token de sessão.',
    //   },
    //   error
    // );
    return;
  }
}

function enviarResposta(
  response: FastifyReply,
  codigoResposta: HTTP_STATUS,
  dadosResposta = {}
): void {
  try {
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.header('accept-encoding', 'utf-8');
    response.header('Access-Control-Allow-Origin', '*');

    const retorno = {
      dados: dadosResposta,
      status: {
        cod: codigoResposta,
        descricao: obterDescricaoCodigoHttp(codigoResposta),
      },
    };

    response.code(codigoResposta).send(retorno);
  } catch (error) {
    console.log(error);
    response.code(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      erro: {
        codigo: 1000,
        mensagem: 'Erro desconhecido.',
        descricao: error.toString(),
      },
    });
  }
}

function enviarRespostaErro(
  response: FastifyReply,
  detalhesErro: InterfaceErro,
  erro: Error
): void {
  enviarResposta(response, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
    erro: { ...detalhesErro, detalhesErro: erro.message },
  });
}

function obterStatus(request: FastifyRequest, response: FastifyReply): void {
  enviarResposta(response, HTTP_STATUS.OK, {
    status: 'API está funcionando! :D',
  });
}

function obterDescricaoCodigoHttp(codigo: number): string {
  const codigosHttp = [
    { cod: 200, descricao: 'OK' },
    { cod: 201, descricao: 'CREATED' },
    { cod: 400, descricao: 'BAD_REQUEST' },
    { cod: 401, descricao: 'UNAUTHORIZED' },
    { cod: 403, descricao: 'FORBIDDEN' },
    { cod: 404, descricao: 'NOT_FOUND' },
    { cod: 409, descricao: 'CONFLICT' },
    { cod: 429, descricao: 'TOO_MANY_REQUESTS' },
    { cod: 500, descricao: 'INTERNAL_SERVER_ERROR' },
  ];

  const codigoHttp = codigosHttp.find((codigoHttp) => {
    return codigoHttp.cod == codigo;
  });

  return codigoHttp?.descricao || 'NAO_MAPEADO';
}

function registrarRotas(app: FastifyInstance): void {
  app.get(
    '/api/status',
    {
      preHandler: [],
    },
    obterStatus
  );
}

export default {
  enviarResposta,
  enviarRespostaErro,
  obterStatus,
  registrarRotas,
  validarTokenAcessoApi,
  validarSessaoUsuario,
  obterCopyright
};
