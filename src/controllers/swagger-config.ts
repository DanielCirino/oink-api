export default {
  routePrefix: 'api/doc',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Cards Journal - Services API',
      description: 'Documentação da API Guardian - Services',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://devrocs.co',
      description: 'Encontre mais informações aqui.'
    },
    host: 'localhost:8080',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    definitions: {}
  }
};
