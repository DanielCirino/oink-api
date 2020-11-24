import GRUPOS_ERRO from '@src/utils/erros/gruposErro';
import { ObjectId } from 'mongodb';
const { codigo: codigoGrupoErro, nome: nomeGrupoErro } = GRUPOS_ERRO.NOTICIA;


export interface INoticia {
  _id?:ObjectId;
  codigo:string;
  categoria:string;
  conteudo:string;
  dataAtualizacao?:Date;
  dataCadastro?:Date;
  dataPublicacao:Date;
  fonte:string;
  imagens: Array<string>;
  resumo:string;
  titulo:string;
  urlThumbnail:string;
}

export const schema = {
  title: 'Notícia',
  description: 'Dados de notícias',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    codigo: {
      type: 'string',
    },
    categoria: {
      type: 'string',
    },
    conteudo: {
      type: 'string',
    },
    fonte: {
      type: 'string',
    },
    resumo: {
      type: 'string',
    },
    titulo: {
      type: 'string',
    },
    urlThumbnail: {
      type: 'string',
    },
    imagens: {
      type: 'array',
    },
    dataPublicacao: {
      format: 'date-time',
    },
    dataCadastro: {
      format: 'date-time',
    },
    dataAtualizacao: {
      format: 'date-time',
    },
  },
  required: ['codigo', 'categoria', 'conteudo', 'fonte','resumo','titulo','urlThumbnail'],
};

export const ERROS_NOTICIA = {
  ERRO_DESCONHECIDO: {
    codigo: codigoGrupoErro + 1,
    descricao: `[${nomeGrupoErro}] Erro desconhecido.`,
  },
  DADOS_INVALIDOS: {
    codigo: codigoGrupoErro + 3,
    descricao: `[${nomeGrupoErro}] Dados de aplicação inválidos.`,
  },
};
