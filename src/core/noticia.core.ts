import moment from 'moment'
import { schema, INoticia } from '@src/models/noticia.model'
import repositorio, { ResultadoAtualizacaoInclusao } from '@src/repositorio'
import validadorSchema from '@src/utils/validador-schema';

const NOME_COLECAO = 'noticias'

function validarDadosNoticia(dadosNoticia: INoticia): any {
  return validadorSchema.validarSchema(schema, dadosNoticia);
}

async function salvarNoticia(
  dadosNoticia: INoticia
): Promise<ResultadoAtualizacaoInclusao> {
  delete dadosNoticia._id;
  return await repositorio.inserirOuAtualizarDocumento(
    NOME_COLECAO,
    dadosNoticia,
    { codigo: dadosNoticia.codigo },
    { dataCadastro: new Date() }
  );
}

async function obterNoticiaPorId(id: string): Promise<INoticia> {
  return await repositorio.obterDocumentoPorId(NOME_COLECAO, id);
}

async function obterNoticiaPorCodigo(codigo: string): Promise<INoticia> {
  const resultado = await repositorio.obterDocumentoPorChave(NOME_COLECAO, {
    codigo,
  });
  return resultado;
}

async function pesquisarNoticias(
  texto: string,
  limite = 10
): Promise<Array<INoticia>> {
  return await repositorio.pesquisarTexto(NOME_COLECAO, texto, limite);
}

async function listarNoticias(
  filtros = {},
  ordenacao = {},
  maximoRegistros = 0,
  offset = -1
): Promise<Array<INoticia>> {
  return await repositorio.listarDocumentos(
    NOME_COLECAO,
    filtros,
    ordenacao,
    maximoRegistros,
    offset
  );
}

function gerarCodigoNoticia(tamanho = 6): string {
  const caracteres =
    '123456789QWERTYUPASDFGHJKLZXCVBNM987654321MNBVCXZLKJHGFDSAPIUYTREWQ';
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    resultado += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }
  return `${moment().format('MMMYY').toUpperCase()}-${resultado}`;
}

export default {
  validarDadosNoticia,
  obterNoticiaPorId,
  obterNoticiaPorCodigo,
  salvarNoticia,
  pesquisarNoticias,
  listarNoticias,
  gerarCodigoNoticia
}
