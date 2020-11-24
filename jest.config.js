const {
  resolve
} = require('path')

const diretorioRaiz = resolve(__dirname)

module.exports = {
  rootDir: diretorioRaiz,
  displayName: 'testes-unidade',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1'
  },

}