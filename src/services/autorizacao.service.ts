import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';
import config, { IConfig } from 'config';

const configuracaoSeguranca: IConfig = config.get('seguranca');

export enum TEMPO_EXPIRACAO_TOKEN {
  '24_HRS' = 86400,
  '12_HRS' = 43200,
  '6_HRS' = 21600,
  '3_HRS' = 10800,
  '90_MIN' = 5400,
  '30_MIN' = 1800,
  '15_MIN' = 900,
  'MINIMO' = 1,
}

async function criptografarSenha(senha: string): Promise<string> {
  return await bcrypt.hash(senha, 10);
}

async function compararSenhas(
  senha: string,
  senhaCriptografada: string
): Promise<boolean> {
  return await bcrypt.compare(senha, senhaCriptografada);
}

function gerarToken(
  dadosToken: any,
  expiraEm = TEMPO_EXPIRACAO_TOKEN['24_HRS']
): string {
  return jwt.sign(
    dadosToken,
    configuracaoSeguranca.get<string>('CRYPTO_SECRET_KEY_SERVER'),
    {
      expiresIn: `${expiraEm}s`,
    }
  );
}

function decodificarTokenSessao(token: string): any {
  return jwt.verify(
    token,
    configuracaoSeguranca.get<string>('CRYPTO_SECRET_KEY_SERVER')
  );
}

function gerarIdentificadorUniversal(): string {
  return uuidV4();
}

function validarIdentificadorUnico(idenificador: string): boolean {
  const regexUuidV4 = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
  return regexUuidV4.test(idenificador);
}

export default {
  criptografarSenha,
  compararSenhas,
  gerarToken,
  decodificarTokenSessao,
  gerarIdentificadorUniversal,
  validarIdentificadorUnico,
};
