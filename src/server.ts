import config, { IConfig } from 'config';
import fastify, { FastifyInstance } from 'fastify';
import fastifySwagger from 'fastify-swagger';
import fastifyCors from 'fastify-cors';
import fastifyCompress from 'fastify-compress';
import fastifyHelmet from 'fastify-helmet';

import swaggerConfig from '@src/controllers/swagger-config';
import apiController from '@src/controllers/apiController';
import noticiaController from '@src/controllers/noticiaController';
import usuarioController from '@src/controllers/usuarioController';

import repositorio from './repositorio';

const configuracoesApp: IConfig = config.get('app');
const configuracoesLogger: IConfig = config.get('log');

let app: FastifyInstance;
function criarApp(opcoes = {}): FastifyInstance {
  app = fastify(opcoes);
  configurarApp(app);
  configurarControllers(app);

  app.addHook('preValidation', apiController.validarTokenAcessoApi);

  return app;
}

function configurarApp(app: FastifyInstance): void {
  app.register(fastifySwagger, swaggerConfig);
  app.register(fastifyCompress, { global: false });
  app.register(fastifyCors);
  app.register(fastifyHelmet);
}

function configurarControllers(app: FastifyInstance): void {
  apiController.registrarRotas(app);
  noticiaController.registrarRotas(app);
  usuarioController.registrarRotas(app);
}

function obterApp(): FastifyInstance {
  return app;
}

async function iniciarServidor(): Promise<FastifyInstance> {
  try {

    const APP_PORT = configuracoesApp.get<number>('APP_PORT');
    const APP_ADDRESS = configuracoesApp.get<string>('APP_ADDRESS');

    const portaServidor = APP_PORT;
    const enderecoServidor = APP_ADDRESS;

    app = criarApp({
      logger: configuracoesLogger.get<boolean>('LOGGER_ENABLED'),
      level: configuracoesLogger.get<string>('LOGGER_LEVEL'),
    });

    app.listen(portaServidor, enderecoServidor, (error, address) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
      console.log(`[OK] Servidor executando em: ${address}`);
    });

    await app.ready();

    return obterApp();
  } catch (error) {
    console.log(`[ERRO] Erro ao iniciar aplicação: ${error}`);
    throw error;
  }
}

function finalizarServidor(): void {
  repositorio.desconectar();
  obterApp().close();
}

export default { iniciarServidor, finalizarServidor };
