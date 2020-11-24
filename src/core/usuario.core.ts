import {
  IUsuario,
  schema,
  IResultadoLogin,
  RESULTADO_LOGIN,
  STATUS_USUARIO,
} from '@src/models/usuario.model';

import repositorio, { ResultadoAtualizacaoInclusao } from '@src/repositorio';
import autorizacaoService, {
  TEMPO_EXPIRACAO_TOKEN,
} from '@src/services/autorizacao.service';
import validadorSchema from '@src/utils/validador-schema';
import { ObjectId } from 'mongodb';

const NOME_COLECAO = 'usuarios';

function validarDadosUsuario(dadosUsuario: IUsuario): any {
  return validadorSchema.validarSchema(schema, dadosUsuario);
}

async function salvarUsuario(
  dadosUsuario: IUsuario
): Promise<ResultadoAtualizacaoInclusao> {
  const validacaoDados = validarDadosUsuario(dadosUsuario);
  delete dadosUsuario._id;
  delete dadosUsuario.dataCadastro;

  if (!validacaoDados.eValido) {
    return {
      documento: dadosUsuario,
      sucesso: false,
      detalhesErro: validacaoDados.erros,
      foiAtualizado: false,
      foiIncluido: false,
      quantidadeDocumentos: 1,
    };
  }

  dadosUsuario.dataAtualizacao = new Date();

  return await repositorio.inserirOuAtualizarDocumento(
    NOME_COLECAO,
    dadosUsuario,
    { email: dadosUsuario.email, documento: dadosUsuario.documento },
    { dataCadastro: new Date() }
  );
}

async function obterUsuarioPorId(id: string): Promise<IUsuario> {
  return await repositorio.obterDocumentoPorId(NOME_COLECAO, id);
}

async function obterUsuarioPorDocumento(
  documento: number
): Promise<IUsuario> {
  try {
    const resultado = await repositorio.obterDocumentoPorChave(NOME_COLECAO, {
      documento: documento,
    });
    return resultado;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function obterUsuarioPorEmail(email: string): Promise<IUsuario> {
  try {
    const resultado = await repositorio.obterDocumentoPorChave(NOME_COLECAO, {
      email,
    });
    return resultado;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function listarUsuarios(
  filtros = {},
  ordenacao = {},
  maximoRegistros = 0,
  offset = -1
): Promise<Array<IUsuario>> {
  return await repositorio.listarDocumentos(
    NOME_COLECAO,
    filtros,
    ordenacao,
    maximoRegistros,
    offset
  );
}

async function obterQuantidadeUsuarios(): Promise<number> {
  return repositorio.obterTotalDocumentos(NOME_COLECAO);
}

function gerarTokenUsuario(
  idUsuario: string,
  email: string,
  documento: number,
  expiraEm = TEMPO_EXPIRACAO_TOKEN['24_HRS']
): string {
  return autorizacaoService.gerarToken(
    { idUsuario, email, documento },
    expiraEm
  );
}

function decodificarToken(token: string): any {
  return autorizacaoService.decodificarTokenSessao(token);
}

async function fazerLogin(
  nomeUsuario: string,
  senha: string
): Promise<IResultadoLogin> {
  const usuario = await obterUsuarioPorEmail(nomeUsuario.toLocaleLowerCase());

  if (!usuario) {
    return RESULTADO_LOGIN.USUARIO_INEXISTENTE;
  }

  const senhaValida = await autorizacaoService.compararSenhas(
    senha,
    usuario.senha || ''
  );

  if (!senhaValida) {
    return RESULTADO_LOGIN.SENHA_INVALIDA;
  }

  if (usuario.status == STATUS_USUARIO.PENDENTE_ATIVACAO) {
    return RESULTADO_LOGIN.USUARIO_PENDENTE_ATIVACAO;
  }

  const tokenSessao = await gerarTokenUsuario(
    String(usuario._id),
    usuario.email,
    usuario.documento
  );
  return { ...RESULTADO_LOGIN.LOGIN_OK, tokenSessao };
}

export default {
  validarDadosUsuario,
  salvarUsuario,
  obterUsuarioPorId,
  obterUsuarioPorDocumento,
  obterUsuarioPorEmail,
  listarUsuarios,
  obterQuantidadeUsuarios,
  gerarTokenUsuario,
  fazerLogin,
  decodificarToken,
};
