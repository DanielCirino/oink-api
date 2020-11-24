import '../src/utils/module-alias';
import moment from 'moment';
import aplicacaoCore from '@src/core/aplicacao.core';
import { IAplicacao } from '@src/models/aplicacao.model';
import repositorio from '@src/repositorio';
import { IUsuario } from '@src/models/usuario.model';
import usuarioCore from '@src/core/usuario.core';
import autorizacaoService from '@src/services/autorizacao.service';
import testeUtils from '@src/utils/teste.utils';
import { INoticia } from '@src/models/noticia.model';
import noticiaCore from '@src/core/noticia.core';

const TOKEN_ACESSO_API = 'b0339adc-2384-4894-907f-965a62433ac9';
const EMAIL_USUARIO_PADRAO = 'teste@teste.com.br';

const aplicaoPadrao: IAplicacao = {
  nome: 'Aplicação de teste',
  codigoEmissor: 0,
  tokenAcesso: 'b0339adc-2384-4894-907f-965a62433ac9',
  status: 'ATIVO',
  tipo: 'ANDROID',
};

const usuarioPadrao: IUsuario = {
  documento: 12345678900,
  nome: 'Usuário de Teste',
  email: EMAIL_USUARIO_PADRAO,
  status: 'ATIVO',
  perfilAcesso: 'CONSULTA',
  senha: '12345',
};

const noticiaPadrao: INoticia = {
  codigo: "45610",
  categoria: "Jornal Impresso",
  conteudo: "O serviço de pagamentos do WhatsApp traz para o mundo financeiro a discussão sobre os dados dos usuários das redes sociais. Enquadrar o Facebook, dono do aplicativo de mensagens, pode ser o menor dos problemas para o Banco Central (BC).\n \nO grande desafio para o órgão regulador será como assegurar que informações sobre pagamentos dos 130 milhões de usuários do WhatsApp não sejam compartilhadas entre as várias redes sociais controladas por Mark Zuckerberg. Ou que o Facebook não tenha uma vantagem indevida do que sabe sobre seus usuários para oferecer a eles, por exemplo, produtos de crédito. Como garantir não apenas que haja um “chinese wall”, mas que ele realmente funcione?\n \nEssa não é uma questão simples. Facebook e discussões sobre privacidade andam juntos há anos. Nesta semana, a corte mais alta da Alemanha confirmou a visão do órgão antitruste do país segundo a qual o Facebook precisa do consentimento expresso de seus usuários para compartilhar informações sobre eles com outros serviços, inclusive Instagram e WhatsApp. “O Facebook precisa dar aos usuários a chance de revelar menos sobre eles próprios - principalmente o que eles revelam para fora do Facebook”, afirmou o juiz Peter Meier-Beck em sua decisão.\n \nPreocupações com lavagem de dinheiro e fraudes também estão no radar do BC, que tem normas específicas sobre essas questões, mas aplicáveis apenas a instituições reguladas por ele. Nos últimos dias, o serviço de pagamentos do WhatsApp suscitou, no setor, debates sobre a capacidade da rede social de ter controle sobre o tipo de transação que poderia passar por ali. Outro receio seria com vazamento de dados dos clientes.\n \nNo entanto, fonte a par do acordo afirma que o desenho dá ao WhatsApp o papel de “token requestor”, o responsável por solicitar que os dados dos cartões e contas dos clientes sejam transformados em um código protegido. Carteiras digitais oferecidas por empresas de tecnologia que atuam no mercado brasileiro de pagamentos atuam nessa forma, e não é necessária autorização do regulador.\n \nNo acordo, o relacionamento com os clientes fica a cargo de bandeiras, emissores e credenciadores. São eles os responsáveis pelo “know your client”, a coleta de dados para proteger o sistema contra fraudes, terrorismo e lavagem de dinheiro. “Os risco são os mesmos que se tem hoje, porque a transação vai acontecer nos trilhos tradicionais do mercado”, diz a fonte.\n \nUm interlocutor do governo especialista em medidas de combate a terrorismo e lavagem de dinheiro avalia que o serviço do WhatsApp inspira cuidados, mas é uma ferramenta necessária de inclusão financeira.",
  dataAtualizacao: moment("2020-06-30T17:24:48.234Z").toDate(),
  dataCadastro: moment("2020-06-30T17:24:48.234Z").toDate(),
  dataPublicacao: moment("2020-06-25T03:00:00.000Z").toDate(),
  fonte: "Valor Econômico [Talita Moreira e Flávia Furlan]",
  imagens: [],
  resumo: "O serviço de pagamentos do WhatsApp traz para o mundo financeiro a  discussão sobre os dados dos usuários das redes sociais. Enquadrar o  Facebook, dono do aplicativo de mensagens, pode ser o menor dos  problemas para o Banco Central (BC). O grande desafio para o órgão regulador será como  assegurar que informações sobre pagamentos dos 130 milhões de usuários  do WhatsApp não sejam compartilhadas entre as várias redes sociais  controladas por Mark Zuckerberg.",
  titulo: "Chegada de big techs abre debate sobre dados",
  urlThumbnail: "/CardClipping/imageNews/Logos2/whatsup.jpg"
};

async function configurarBaseDados() {
  try {
    const db = await repositorio.conectar();
    await db.dropDatabase();
    await db
      .collection('noticias')
      .createIndex({ resumo: 'text', conteudo: 'text', titulo: 'text' });

    console.log('[OK] Banco de dados configurado com sucesso.');
  } catch (error) {
    console.log(error)
  }


}

async function criarAplicacaoPadraoTestes() {
  const resultado = await aplicacaoCore.salvarAplicacao(aplicaoPadrao);
  if (resultado.sucesso) {
    console.log('[OK] Aplicação padrão criada com sucesso.');
  } else {
    console.log('[ERRO] Erro ao criar aplicação padrão.');
  }
}

async function criarNoticiaPadrao() {
  const resultado = await noticiaCore.salvarNoticia(noticiaPadrao);

  if (resultado.sucesso) {
    console.log('[OK] Notícia padrão criado com sucesso.');
  } else {
    console.log('[ERRO] Erro  ao criar notícia padrão.');
  }
}

async function gerarUsuarioValido(): Promise<IUsuario> {
  return {
    documento: parseInt(moment().format('MMhhmmssSSS')),
    nome: `Usuário de Teste ${moment().format('hhmmssSSS')}`,
    email: `${moment().format('hhmmssSSS')}@teste.com.br`,
    status: 'ATIVO',
    perfilAcesso: 'CONSULTA',
    senha: await autorizacaoService.criptografarSenha('12345'),
  };
}

function gerarNoticiaValida(): INoticia {
  return {
    codigo: noticiaCore.gerarCodigoNoticia(),
    categoria: `Categoria ${moment().format('MMhhmmssSSS')}`,
    conteudo: 'Mussum Ipsum, cacilds vidis litro abertis. Interagi no mé, cursus quis, vehicula ac nisi. Detraxit consequat et quo num tendi nada.  Quem manda na minha terra sou euzis! Admodum accumsan disputationi eu sit. Vide electram sadipscing et per.',
    dataAtualizacao: moment('2020-06-30T17:24:48.234Z').toDate(),
    dataCadastro: moment('2020-06-30T17:24:48.234Z').toDate(),
    dataPublicacao: moment('2020-06-25T03:00:00.000Z').toDate(),
    fonte: `Nome da fonte [${moment().format('MMhhmmssSSS')}]`,
    imagens: [],
    resumo: 'Mussum Ipsum, cacilds vidis litro abertis. Quem num gosta di mim que vai caçá sua turmis! Aenean aliquam molestie leo, vitae iaculis nisl. Si num tem leite então bota uma pinga aí cumpadi! Si u mundo tá muito paradis? Toma um mé que o mundo vai girarzis!',
    titulo: 'Mussum Ipsum, cacilds vidis litro abertis. Diuretics paradis num copo é motivis de denguis. Mais vale um bebadis conhecidiss, que um alcoolatra anonimis. Quem num gosta di mé, boa gentis num é. Mauris nec dolor in eros commodo tempor. Aenean aliquam molestie leo, vitae iaculis nisl. Não sou faixa preta cumpadi, sou preto inteiris, inteiris. Interessantiss quisso pudia ce receita de bolis, mais bolis eu num gostis. A ordem dos tratores não altera o pão duris. Nec orci ornare consequat. Praesent lacinia ultrices consectetur. Sed non ipsum felis.',
    urlThumbnail: '/CardClipping/imageNews/Logos2/whatsup.jpg'
  };
}

async function criarUsuarioPadrao() {
  const dadosUsuario = {
    ...usuarioPadrao,
    senha: await autorizacaoService.criptografarSenha('12345'),
  };
  const resultado = await usuarioCore.salvarUsuario(dadosUsuario);
  if (resultado.sucesso) {
    console.log('[OK] Usuário padrão criado com sucesso.');
  } else {
    console.log('[ERRO] Erro ao criar usuário padrão.');
  }
}



async function executar(): Promise<void> {
  try {
    await configurarBaseDados();
    await criarAplicacaoPadraoTestes();
    await criarNoticiaPadrao()
    await criarNoticiaPadrao();
    await criarUsuarioPadrao();
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function finalizar(): Promise<void> {
  await repositorio.desconectar();
}

export default {
  TOKEN_ACESSO_API,
  aplicaoPadrao,
  noticiaPadrao,
  gerarNoticiaValida,
  usuarioPadrao,
  gerarUsuarioValido,
  executar,
  finalizar,
};
