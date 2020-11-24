import './utils/module-alias';
import server from '@src/server';
import logger from '@src/utils/logger';

(async (): Promise<void> => {
  try {
    await server.iniciarServidor();
    const sinaisSaida: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    sinaisSaida.map((sinal) =>
      process.on(sinal, async () => {
        try {
          await server.finalizarServidor();
          logger.info(`\n[OK] App finalizado com sucesso!!!`);
          process.exit(0);
        } catch (error) {
          logger.error(`\n[OK] App finalizado com erro: ${error}.`);
          process.exit(1);
        }
      })
    );
  } catch (error) {
    logger.error(`\n[ERRO] App finalizado com erro: ${error}.`);
    process.exit(1);
  }
})();
