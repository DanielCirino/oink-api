const {
  resolve
} = require('path')
const diretorioRaiz = resolve(__dirname, '..')
const configuracaoRaiz = require(`${diretorioRaiz}/jest.config.js`)

module.exports = {
  ...configuracaoRaiz,
  ...{
    rootDir: diretorioRaiz,
    displayName: 'testes-funcionais',
    testMatch: ['<rootDir>/test/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts']

  }
}