import { IAplicacao, schema } from '@src/models/aplicacao.model';
import repositorio, { ResultadoAtualizacaoInclusao } from '@src/repositorio';
import autorizacao from '@src/services/autorizacao.service';
import validadorSchema from '@src/utils/validador-schema';

const NOME_COLECAO = 'aplicacoes';

function validarDadosAplicacao(dadosAplicacao: IAplicacao): any {
  return validadorSchema.validarSchema(schema, dadosAplicacao);
}

async function salvarAplicacao(
  dadosAplicacao: IAplicacao
): Promise<ResultadoAtualizacaoInclusao> {
  dadosAplicacao.dataAtualizacao = new Date();

  return await repositorio.inserirOuAtualizarDocumento(
    NOME_COLECAO,
    dadosAplicacao,
    { tokenAcesso: dadosAplicacao.tokenAcesso },
    { dataCadastro: new Date() }
  );
}

async function obterAplicacaoPorId(id: string): Promise<IAplicacao> {
  return await repositorio.obterDocumentoPorId(NOME_COLECAO, id);
}

async function obterAplicacaoPorTokenAcesso(
  token: string
): Promise<IAplicacao> {
  const resultado = await repositorio.obterDocumentoPorChave(NOME_COLECAO, {
    tokenAcesso: token,
  });

  return resultado;
}

async function obterAplicacoesPorEmissor(
  codigoEmissor: number
): Promise<Array<IAplicacao>> {
  return await listarAplicacoes({ codigoEmissor });
}

async function listarAplicacoes(
  filtros = {},
  ordenacao = {},
  maximoRegistros = 0,
  offset = -1
): Promise<Array<IAplicacao>> {
  return await repositorio.listarDocumentos(
    NOME_COLECAO,
    filtros,
    ordenacao,
    maximoRegistros,
    offset
  );
}

function gerarTokenAcesso(): string {
  return autorizacao.gerarIdentificadorUniversal();
}

export default {
  validarDadosAplicacao,
  salvarAplicacao,
  obterAplicacaoPorId,
  obterAplicacaoPorTokenAcesso,
  obterAplicacoesPorEmissor,
  listarAplicacoes,
  gerarTokenAcesso,
};
