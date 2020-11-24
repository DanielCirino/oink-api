import GRUPOS_ERRO from '@src/utils/erros/gruposErro';
const { codigo: codigoGrupoErro, nome: nomeGrupoErro } = GRUPOS_ERRO.USUARIO;

export interface IUsuario {
  _id?: string;
  documento: number;
  nome: string;
  email: string;
  senha?: string;
  status: string;
  perfilAcesso: string;
  dataCadastro?: Date | string;
  dataAtualizacao?: Date | string;
}

export interface IResultadoLogin {
  codigo: number;
  descricao: string;
  tokenSessao?: string;
}

export enum STATUS_USUARIO {
  PENDENTE_ATIVACAO = 'PENDENTE_ATIVACAO',
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export enum PERFIL_ACESSO {
  ADMIN = 'ADMIN',
  OPERACAO = 'OPERACAO',
  CONSULTA = 'CONSULTA',
}

export const schema = {
  title: 'Usuário',
  description: 'Dados de usuário do sistema',
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    documento: {
      type: 'number',
    },
    nome: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    senha: {
      type: 'string',
    },
    status: {
      enum: ['PENDENTE_ATIVACAO', 'ATIVO', 'INATIVO'],
    },
    perfilAcesso: {
      enum: ['ADMIN', 'OPERACAO', 'CONSULTA'],
    },
    dataCadastro: {
      format: 'date-time',
    },
    dataAtualizacao: {
      format: 'date-time',
    },
  },
  required: ['documento', 'nome', 'email', 'status', 'perfilAcesso'],
};

export const ERROS_USUARIO = {
  ERRO_DESCONHECIDO: {
    codigo: codigoGrupoErro + 1,
    descricao: `[${nomeGrupoErro}] Erro desconhecido.`,
  },
  ACESSSO_NEGADO: {
    codigo: codigoGrupoErro + 2,
    descricao: `[${nomeGrupoErro}] Acesso negado.`,
  },
  ERRO_ATIVACAO_CADASTRO: {
    codigo: codigoGrupoErro + 3,
    descricao: `[${nomeGrupoErro}] Erro de ativação do cadastro.`,
  },
  ERRO_SALVAR_USUARIO: {
    codigo: codigoGrupoErro + 4,
    descricao: `[${nomeGrupoErro}] Erro ao salvar usuário.`,
  },
  USUARIO_JA_CADASTRADO: {
    codigo: codigoGrupoErro + 5,
    descricao: `[${nomeGrupoErro}] Usuario já cadastrado.`,
  },
  ERRO_LOGOFF: {
    codigo: codigoGrupoErro + 6,
    descricao: `[${nomeGrupoErro}] Erro ao fazer logoff`,
  },
  USUARIO_EXPIRADO: {
    codigo: codigoGrupoErro + 7,
    descricao: `[${nomeGrupoErro}] Usuário expirado.`,
  },
  CODIGO_ATIVACAO_INVALIDO: {
    codigo: codigoGrupoErro + 8,
    descricao: `[${nomeGrupoErro}] Código de ativação inválido inexistente.`,
  },
  DISPOSITIVO_NAO_VINCULADO_AO_LOGIN: {
    codigo: codigoGrupoErro + 9,
    descricao: `[${nomeGrupoErro}] Dispositivo não vinculado ao login.`,
  },
  TOKEN_SESSAO_NAO_INFORMADO: {
    codigo: codigoGrupoErro + 10,
    descricao: `[${nomeGrupoErro}] Token sessão não informado ou inválido`,
  },
  SESSAO_INVALIDA: {
    codigo: codigoGrupoErro + 12,
    descricao: `[${nomeGrupoErro}] Sessão inválida .`,
  },
  USUARIO_NAO_ENCONTRADO: {
    codigo: codigoGrupoErro + 13,
    descricao: `[${nomeGrupoErro}] Usuário não encontrado.`,
  },
  LISTA_VAZIA: {
    codigo: codigoGrupoErro + 14,
    descricao: `[${nomeGrupoErro}] Nenhum registro encontrado.`,
  },
  DADOS_INVALIDOS: {
    codigo: codigoGrupoErro + 15,
    descricao: `[${nomeGrupoErro}] Dados informados inválidos.`,
  },
  ID_INVALIDO: {
    codigo: codigoGrupoErro + 16,
    descricao: `[${nomeGrupoErro}] Id de usuário inválido ou não informado.`,
  },
  ERRO_LOGIN: {
    codigo: codigoGrupoErro + 17,
    descricao: `[${nomeGrupoErro}] Erro ao fazer login.`,
  },
  SENHA_INVALIDA: {
    codigo: codigoGrupoErro + 18,
    descricao: `[${nomeGrupoErro}] Senha inválida.`,
  },
  USUARIO_INATIVO: {
    codigo: codigoGrupoErro + 19,
    descricao: `[${nomeGrupoErro}] Usuário inativo.`,
  },
  SENHA_EXPIRADA: {
    codigo: codigoGrupoErro + 20,
    descricao: `[${nomeGrupoErro}] Senha expirada.`,
  },
  USUARIO_PENDENTE_ATIVACAO: {
    codigo: codigoGrupoErro + 21,
    descricao: `[${nomeGrupoErro}] Usuário pendente de ativação.`,
  },
  TOKEN_ATIVACAO_NAO_INFORMADO: {
    codigo: codigoGrupoErro + 22,
    descricao: `[${nomeGrupoErro}] Token de ativação de cadastro não informado.`,
  },
  TOKEN_ALTERACAO_SENHA_NAO_INFORMADO: {
    codigo: codigoGrupoErro + 23,
    descricao: `[${nomeGrupoErro}] Token de alteração de senha não informado.`,
  },
  TOKEN_ALTERACAO_SENHA_INVALIDO: {
    codigo: codigoGrupoErro + 24,
    descricao: `[${nomeGrupoErro}] Token de alteração de senha inválido/expirado.`,
  },
  ERRO_EMAIL_ATIVACAO: {
    codigo: codigoGrupoErro + 25,
    descricao: `[${nomeGrupoErro}] Erro ao enviar e-mail de ativação.`,
  },
  USUARIO_JA_ATIVADO: {
    codigo: codigoGrupoErro + 26,
    descricao: `[${nomeGrupoErro}] Usuário já está ativo.`,
  },
};

export const RESULTADO_LOGIN = {
  LOGIN_OK: {
    codigo: 0,
    descricao: 'Login realizado com sucesso',
  },
  USUARIO_INEXISTENTE: {
    codigo: 1,
    descricao: 'Usuário não cadastrado',
  },
  SENHA_INVALIDA: {
    codigo: 2,
    descricao: 'Senha inválida',
  },
  USUARIO_INATIVO: {
    codigo: 3,
    descricao: 'Usuário inativo',
  },
  SENHA_EXPIRADA: {
    codigo: 4,
    descricao: 'Senha expirada',
  },
  USUARIO_PENDENTE_ATIVACAO: {
    codigo: 5,
    descricao: 'Usuário pendente de ativação.',
  },
  ERRO_LOGIN: {
    codigo: 6,
    descricao: 'Erro ao efetuar login',
  },
};
