import './utils/module-alias';



import repositorio from './repositorio';
import aplicacaoCore from './core/aplicacao.core';
import { IAplicacao } from './models/aplicacao.model';
import { IUsuario } from './models/usuario.model';
import usuarioCore from './core/usuario.core';

async function criarIndicesBancoDados() {
  const db = await repositorio.conectar();

  await db.collection('clientes').createIndex({ nome: 'text' });

  await db
    .collection('produtos')
    .createIndex({ nome: 'text', descricao: 'text' });

  await db.collection('contas_bancarias').createIndex({ nomeConta: 'text' });
}

async function criarAplicacaoPadrao() {
  const aplicaoPadrao: IAplicacao = {
    nome: 'Aplicação de teste',
    codigoEmissor: 0,
    tokenAcesso: 'b0339adc-2384-4894-907f-965a62433ac9',
    status: 'ATIVO',
    tipo: 'ANDROID',
  };
  const resultado = await aplicacaoCore.salvarAplicacao(aplicaoPadrao);
  if (resultado.sucesso) {
    console.log('[OK] Aplicação padrão criada com sucesso.');
  } else {
    console.log('[ERRO] Erro ao criar aplicação padrão.');
  }
}



async function cadastrarUsuarios() {
  const usuarioPadrao: IUsuario = {
    documento: 12345678900,
    nome: 'Usuário de Teste',
    email: 'gestao@fastfit.com.br',
    status: 'ATIVO',
    perfilAcesso: 'ADMIN',
    senha: 'Fastfit@20',
  };

  const resultado = await usuarioCore.salvarUsuario(usuarioPadrao);
  if (resultado.sucesso) {
    `[OK] Usuário ${usuarioPadrao.nome} cadastrada com sucesso.`;
  } else {
    `[ERRO] Erro ao cadastrar conta bancária ${usuarioPadrao.nome}.`;
  }
}

(async () => {
  const listaColecoes = await repositorio.obterListaColecoes();

  const colecaoExiste = listaColecoes.includes('contas_bancarias');
  if (!colecaoExiste) {
    await criarIndicesBancoDados();
    await criarAplicacaoPadrao();
    await cadastrarUsuarios();
  }

  await repositorio.desconectar();
})();
