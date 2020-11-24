import moment from 'moment'
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import api, { HTTP_STATUS } from '@src/controllers/apiController';

import noticaCore from '@src/core/noticia.core';
import { number } from 'yargs';
import { ERROS_NOTICIA } from '@src/models/noticia.model';


interface IParams {
  idNoticia: string;
  codigoNoticia: string;
  textoPesquisa: string
}

interface IQuery {
  /**
 * query params
 * q=:text
 * dataPublicacao[lte]=:date
 * dataPublicacao[gte]=:date
 * ordenarPor=+/-:campo
 * limite=number
 * offset=number
 */
  q: string;
  data_publicacao_de: string;
  data_publicacao_ate: string;
  ordenar_por: string;
  limite: number;
  offset: number;
}

interface IFiltros {
  dataPublicacao: {
    $gte?: Date | undefined;
    $lte?: Date | undefined;
  }
}

const recurso = '/noticias'

function obterStatusApi(request: FastifyRequest, reply: FastifyReply): void {
  api.enviarResposta(reply, HTTP_STATUS.OK, {
    status: 'API de NOTICIAS está funcionando!!',
  });
}

async function listarNoticias(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const {
    data_publicacao_de: dataInicioPublicacao,
    data_publicacao_ate: dataFimPublicacao,
    ordenar_por: ordenarPor,
    limite,
    offset } = request.query as IQuery

  console.info(
    moment(dataInicioPublicacao, 'YYYY-MM-DD').toISOString(),
    dataFimPublicacao,
    ordenarPor,
    limite,
    offset
  )

  if (!dataInicioPublicacao && !dataFimPublicacao) {
    api.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
      erro: 'Nenhum parâmetro de pesquisa informado.'
    })
    return
  }

  const filtros: IFiltros = {
    dataPublicacao: {
      $gte: undefined,
      $lte: undefined
    }
  }

  const ordenacao = {
    dataPublicacao: -1
  }

  if (dataInicioPublicacao) {
    filtros.dataPublicacao.$gte = moment(
      dataInicioPublicacao,
      'YYYY-MM-DD'
    ).toDate()
  } else {
    delete filtros.dataPublicacao.$gte
  }

  if (dataFimPublicacao) {
    filtros.dataPublicacao.$lte = moment(
      dataFimPublicacao,
      'YYYY-MM-DD'
    ).toDate()
  } else {
    delete filtros.dataPublicacao.$lte
  }

  console.log(filtros)
  const noticias = await noticaCore.listarNoticias(filtros, ordenacao)

  api.enviarResposta(reply, 200, { noticias: noticias })
}

async function pesquisarClientePorNome(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { textoPesquisa } = request.params as IParams;
    if (!textoPesquisa) {
      api.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: {
          ...ERROS_NOTICIA.DADOS_INVALIDOS,
          detalhes: 'Texto para pesquisa de notícias não informado.',
        },
      });
      return;
    }
    const listaDeNoticias = await noticaCore.pesquisarNoticias(
      textoPesquisa
    );
    api.enviarResposta(reply, HTTP_STATUS.OK, { noticias: listaDeNoticias });
  } catch (error) {
    api.enviarRespostaErro(
      reply,
      {
        ...ERROS_NOTICIA.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao pesquisar notícias.',
      },
      error
    );
  }
}

async function obterNoticiaPorId(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { idNoticia } = request.params as IParams;
    if (!idNoticia) {
      api.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: {
          ...ERROS_NOTICIA.DADOS_INVALIDOS,
          detalhes: 'Id da notícia não informado.',
        },
      });
      return;
    }

    const noticia = await noticaCore.obterNoticiaPorId(idNoticia);

    if (!noticia) {
      api.enviarResposta(reply, HTTP_STATUS.NOT_FOUND, {
        erro: {
          ...ERROS_NOTICIA.DADOS_INVALIDOS,
          detalhes: 'Não existe notícia cadastrada com o Id informado.',
        },
      });
      return;
    }
    api.enviarResposta(reply, HTTP_STATUS.OK, { cliente: noticia });
  } catch (error) {
    api.enviarRespostaErro(
      reply,
      {
        ...ERROS_NOTICIA.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao obter notícia por id.',
      },
      error
    );
  }
}

async function obterNoticiaPorCodigo(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const { codigoNoticia } = request.params as IParams;
    if (!codigoNoticia) {
      api.enviarResposta(reply, HTTP_STATUS.BAD_REQUEST, {
        erro: {
          ...ERROS_NOTICIA.DADOS_INVALIDOS,
          detalhes: 'Código da notícia não informado.',
        },
      });
      return;
    }

    const noticia = await noticaCore.obterNoticiaPorCodigo(codigoNoticia);

    if (!noticia) {
      api.enviarResposta(reply, HTTP_STATUS.NOT_FOUND, {
        erro: {
          ...ERROS_NOTICIA.DADOS_INVALIDOS,
          detalhes: 'Não existe notícia cadastrada com o código informado.',
        },
      });
      return;
    }
    api.enviarResposta(reply, HTTP_STATUS.OK, { cliente: noticia });
  } catch (error) {
    api.enviarRespostaErro(
      reply,
      {
        ...ERROS_NOTICIA.ERRO_DESCONHECIDO,
        mensagem: 'Erro ao obter notícia por código.',
      },
      error
    );
  }
}


function registrarRotas(app: FastifyInstance): void {
  app.get(`${recurso}/api/status`, {}, obterStatusApi);
  // app.get(`${recurso}/:idCliente`, {}, obterclientePorId);
  app.get(`${recurso}/codigo/:codigoNoticia`, {}, obterNoticiaPorCodigo);


  app.get(`${recurso}/pesquisa/:textoPesquisa`, {}, pesquisarClientePorNome);
  app.get(`${recurso}`, {}, listarNoticias);
}

export default {
  listarNoticias,
  registrarRotas,
  obterStatusApi
}

