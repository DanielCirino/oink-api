import autorizacao, { TEMPO_EXPIRACAO_TOKEN } from '../autorizacao.service';
let tokenExpirado = ''
describe('Teste seviço de autorização', () => {
  it('Deve gerar uma senha criptografada e comparar a senha com sucesso.', async () => {
    const senhaCriptografada = await autorizacao.criptografarSenha('@T3ste');
    const validacaoSenha = await autorizacao.compararSenhas(
      '@T3ste',
      senhaCriptografada
    );
    expect(validacaoSenha).toBeTruthy();
  });

  it('Deve gerar uma senha criptografada e comparar a senha com falha.', async () => {
    const senhaCriptografada = await autorizacao.criptografarSenha('@T3ste');
    const validacaoSenha = await autorizacao.compararSenhas(
      'senha invalida',
      senhaCriptografada
    );
    expect(validacaoSenha).toBeFalsy();
  });

  it('Deve gerar um identificador universal e validar com sucesso', () => {
    const identificador = autorizacao.gerarIdentificadorUniversal();
    const validacaoIdentificador = autorizacao.validarIdentificadorUnico(
      identificador
    );

    expect(validacaoIdentificador).toBeTruthy();
  });

  it('Deve gerar um identificador universal e validar com erro', () => {
    const identificador = autorizacao.gerarIdentificadorUniversal();
    const validacaoIdentificador = autorizacao.validarIdentificadorUnico(
      identificador + 'invalido'
    );

    expect(validacaoIdentificador).toBeFalsy();
  });

  it('Deve gerar um token de sessão e decodificar com sucesso', () => {
    const token = autorizacao.gerarToken(
      { teste: 'token' },
      TEMPO_EXPIRACAO_TOKEN.MINIMO
    );

    tokenExpirado = token
    const tokenDecodificado = autorizacao.decodificarTokenSessao(token);
    expect(tokenDecodificado.teste).toEqual('token');
  });

  it('Deve gerar erro ao decodificar um token de sessão expirado', async () => {

    try {
      await autorizacao.decodificarTokenSessao(tokenExpirado);
    } catch (error) {
      expect(error.name).toEqual('TokenExpiredError');
    }
  });
});
