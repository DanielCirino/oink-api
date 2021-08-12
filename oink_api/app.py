from fastapi import FastAPI
from oink_api.controllers import api, usuarios,aplicacoes


def criar_aplicacao():
  app = FastAPI(title="Oink API",
                description="API de integração sistema Oink - Finanças Pessoais",
                version="0.1.0")

  api.registrar_rotas(app)
  aplicacoes.registrar_rotas(app)
  usuarios.registrar_rotas(app)

  return app
