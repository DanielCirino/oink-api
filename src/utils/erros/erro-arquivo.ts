import GRUPOS_ERRO from '@src/utils/erros/gruposErro';
import { HTTP_STATUS } from '@src/controllers/apiController';
const { codigo, descricao } = GRUPOS_ERRO.APLICACAO;

export default {
  ERRO_DESCONHECIDO: {
    codigo: codigo + 1,
    descricao: `[${descricao}]Erro desconhecido.`,
    codigoHttp: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  DADOS_INVALIDOS: {
    codigo: codigo + 2,
    descricao: `[${descricao}] Dados inválidos.`,
    codigoHttp: HTTP_STATUS.BAD_REQUEST,
  },
  ERRO_SALVAR_ARQUIVO: {
    codigo: codigo + 3,
    descricao: `[${descricao}] Erro ao salvar arquivo.`,
    codigoHttp: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  ARQUIVO_NAO_ENCONTRADO: {
    codigo: codigo + 4,
    descricao: `[${descricao}] Arquivo não encontrado.`,
    codigoHttp: HTTP_STATUS.NOT_FOUND,
  },
};
