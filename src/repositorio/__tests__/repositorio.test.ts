import { Db } from 'mongodb';
import repositorio from '..';

describe('Testes do módulo de conexão com banco de dados.', () => {
  let mongodb: Db;

  it('Deve retorna uma instância de conexão com o banco de dados', async () => {
    mongodb = await repositorio.conectar();
    expect(mongodb.databaseName).toEqual('cards_journal_tests');
  });

  it('Deve desconectar o banco de dados com sucesso', async () => {
    expect(await repositorio.desconectar()).toBeTruthy();
  });
});
