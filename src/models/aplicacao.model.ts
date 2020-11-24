import GRUPOS_ERRO from '@src/utils/erros/gruposErro';
import { ObjectId } from 'mongodb';
const { codigo: codigoGrupoErro, nome: nomeGrupoErro } = GRUPOS_ERRO.APLICACAO;

export enum STATUS_APLICACAO {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO',
}

export enum TIPO_APLICACAO {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  WEB = 'WEB',
}
export interface IAplicacao {
  _id?: ObjectId;
  codigoEmissor: number;
  nome: string;
  tokenAcesso: string;
  status: string;
  tipo: string;
  dataCadastro?: Date;
  dataAtualizacao?: Date;
}

export const schema = {
  title: 'Aplicacao',
  description: 'Dados de aplicações autorizadas a consumir API',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    nome: {
      type: 'string',
    },
    tokenAcesso: {
      type: 'string',
    },
    status: {
      enum: ['ATIVO', 'INATIVO', 'BLOQUEADO'],
    },
    tipo: {
      enum: ['ANDROID', 'IOS', 'WEB'],
    },
    dataCadastro: {
      format: 'date-time',
    },
    dataAtualizacao: {
      format: 'date-time',
    },
  },
  required: ['nome', 'tokenAcesso', 'status', 'tipo'],
};

export const ERROS_APLICACAO = {
  ERRO_DESCONHECIDO: {
    codigo: codigoGrupoErro + 1,
    descricao: `[${nomeGrupoErro}] Erro desconhecido.`,
  },
  TOKEN_ACESSO_INVALIDO: {
    codigo: codigoGrupoErro + 2,
    descricao: `[${nomeGrupoErro}] Token de acesso inválido ou não informado.`,
  },
  DADOS_INVALIDOS: {
    codigo: codigoGrupoErro + 3,
    descricao: `[${nomeGrupoErro}] Dados de aplicação inválidos.`,
  },
  ID_APLICACAO_INVALIDO: {
    codigo: codigoGrupoErro + 3,
    descricao: `[${nomeGrupoErro}] Chave de aplicação inválida ou não informada.`,
  },
};
