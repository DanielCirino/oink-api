import { MongoClient, ObjectId, Db, MongoClientOptions } from 'mongodb';
import config, { IConfig } from 'config';

export interface ResultadoAtualizacaoInclusao {
  sucesso: boolean;
  foiIncluido: boolean;
  foiAtualizado: boolean;
  documento: any;
  idIncluido?: ObjectId;
  detalhesErro?: any;
  quantidadeDocumentos: number;
}

let database: Db;
let conexao: MongoClient;

const configuracoesBancoDados: IConfig = config.get('database');
const MONGO_DATABASE: string = configuracoesBancoDados.get('MONGO_DATABASE');

const stringConexao = () => {
  const MONGO_AUTH = configuracoesBancoDados.get<number>('MONGO_AUTH');
  const MONGO_USERNAME = configuracoesBancoDados.get('MONGO_USERNAME');
  const MONGO_PASSWORD = configuracoesBancoDados.get('MONGO_PASSWORD');
  const MONGO_HOSTNAME = configuracoesBancoDados.get('MONGO_HOSTNAME');
  const MONGO_PORT = configuracoesBancoDados.get('MONGO_PORT');

  if (MONGO_AUTH === 1) {
    return `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}`;
  }

  return `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`;
};

async function conectar(): Promise<Db> {
  try {
    if (database) {
      return database;
    }
    const opcoesConexao: MongoClientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10,
      // reconnectTries: Number.MAX_VALUE,
      // reconnectInterval: 500,
      connectTimeoutMS: 10000,
    };

    conexao = await MongoClient.connect(stringConexao(), opcoesConexao);

    database = conexao.db(MONGO_DATABASE);

    return database;
  } catch (error) {
    console.log(`[ERRO] Falha ao conectar ao banco de dados: ${error}`);
    console.log(configuracoesBancoDados, stringConexao());
    throw error;
  }
}

async function desconectar(): Promise<boolean> {
  if (!conexao) {
    return true;
  }
  conexao.close();
  return true;
}

async function inserirDocumento(
  nomeColecao: string,
  documento: any
): Promise<ResultadoAtualizacaoInclusao> {
  try {
    const db = await conectar();
    const cursor = await db.collection(nomeColecao).insertOne(documento);

    return {
      sucesso: true,
      foiIncluido: true,
      foiAtualizado: false,
      documento: cursor.ops[0],
      quantidadeDocumentos: 1,
    };
  } catch (error) {
    return {
      sucesso: false,
      foiAtualizado: false,
      foiIncluido: false,
      detalhesErro: error,
      documento: documento,
      quantidadeDocumentos: 0,
    };
  }
}

async function inserirVariosDocumentos(
  nomeColecao: string,
  listaDocumentos: Array<any>
): Promise<ResultadoAtualizacaoInclusao> {
  try {
    const db = await conectar();
    const cursor = await db.collection(nomeColecao).insertMany(listaDocumentos);

    return {
      sucesso: true,
      foiIncluido: true,
      foiAtualizado: false,
      documento: cursor.ops,
      quantidadeDocumentos: cursor.insertedCount,
    };
  } catch (error) {
    return {
      sucesso: false,
      foiAtualizado: false,
      foiIncluido: false,
      detalhesErro: error,
      documento: listaDocumentos,
      quantidadeDocumentos: 0,
    };
  }
}

async function atualizarDocumento(
  nomeColecao: string,
  documento: any
): Promise<ResultadoAtualizacaoInclusao> {
  try {
    const queryFilter = {
      _id: converterTextoParaObjectId(documento._id),
    };

    delete documento._id;
    const db = await conectar();
    const cursor = await db.collection(nomeColecao).updateOne(queryFilter, {
      $set: documento,
    });

    return {
      sucesso: cursor.modifiedCount > 0 || cursor.matchedCount > 0,
      foiAtualizado: cursor.modifiedCount > 0,
      foiIncluido: false,
      documento: { ...documento, _id: queryFilter._id },
      quantidadeDocumentos: 1,
    };
  } catch (error) {
    return {
      sucesso: false,
      foiIncluido: false,
      foiAtualizado: false,
      detalhesErro: error,
      documento: documento,
      quantidadeDocumentos: 0,
    };
  }
}

async function inserirOuAtualizarDocumento(
  nomeColecao: string,
  documento: any,
  filtro: any,
  valoresPadrao: any
): Promise<ResultadoAtualizacaoInclusao> {
  for (const chave of Object.keys(valoresPadrao)) {
    if (chave in documento) {
      delete documento[chave];
    }
  }

  const db = await conectar();
  const cursor = await db.collection(nomeColecao).updateOne(
    filtro,
    {
      $set: documento,
      $setOnInsert: valoresPadrao,
    },
    { upsert: true }
  );

  return {
    documento,
    idIncluido: cursor.upsertedCount == 1 ? cursor.upsertedId._id : undefined,
    foiIncluido: cursor.upsertedCount > 0,
    foiAtualizado: cursor.modifiedCount > 0,
    sucesso: cursor.upsertedCount > 0 || cursor.modifiedCount > 0,
    quantidadeDocumentos: cursor.modifiedCount,
  };
}

async function obterDocumentoPorId(
  nomeColecao: string,
  id: string
): Promise<any> {
  const objectId = converterTextoParaObjectId(id);
  const db = await conectar();
  const cursor = await db.collection(nomeColecao).findOne({ _id: objectId });

  return cursor;
}

async function obterDocumentoPorChave(
  nomeColecao: string,
  chave = {}
): Promise<any> {
  const db = await conectar();
  const cursor = await db.collection(nomeColecao).findOne(chave);

  return cursor;
}

async function listarDocumentos(
  nomeColecao: string,
  filtros = {},
  ordenacao = {},
  limite = 0,
  offset = -1
): Promise<any[]> {
  const opcoesConsulta = { sort: {}, offset: -1 };

  if (ordenacao != {}) {
    opcoesConsulta.sort = ordenacao;
  }

  if (offset > -1) {
    opcoesConsulta.offset = offset;
  }

  const db = await conectar();

  const cursor = await db
    .collection(nomeColecao)
    .find(filtros, opcoesConsulta)
    .limit(limite)
    .toArray();

  return cursor;
}

async function obterTotalDocumentos(
  nomeColecao: string,
  filtros = {}
): Promise<number> {
  try {
    const db = await conectar();
    const cursor = await db
      .collection(nomeColecao)
      .estimatedDocumentCount(filtros);

    return cursor;
  } catch (error) {
    return error;
  }
}

async function pesquisarTexto(
  nomeColecao: string,
  texto: string,
  limite = 10
): Promise<Array<any>> {
  const db = await conectar();
  const cursor = db
    .collection(nomeColecao)
    .find({
      $text: {
        $search: texto,
      },
    })
    .project({
      score: {
        $meta: 'textScore',
      },
    })
    .sort({
      score: {
        $meta: 'textScore',
      },
    })
    .limit(limite)
    .toArray();

  return cursor;
}

function converterTextoParaObjectId(texto: string | ObjectId): ObjectId {
  return new ObjectId(texto);
}

async function obterListaColecoes(): Promise<Array<string>> {
  await conectar();
  const colecoes = await database.listCollections().toArray();
  const nomeColecoes = colecoes.map((colecao) => {
    return colecao.name;
  });

  return nomeColecoes;
}

export default {
  conectar,
  desconectar,
  converterTextoParaObjectId,
  inserirDocumento,
  inserirVariosDocumentos,
  atualizarDocumento,
  inserirOuAtualizarDocumento,
  obterDocumentoPorId,
  obterDocumentoPorChave,
  listarDocumentos,
  obterTotalDocumentos,
  pesquisarTexto,
  obterListaColecoes,
};
