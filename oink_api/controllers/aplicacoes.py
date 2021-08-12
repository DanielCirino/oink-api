from typing import List

from fastapi import APIRouter

from oink_core.models.aplicacao_model import Aplicacao

router = APIRouter(
  prefix="/v1/aplicacoes",
  tags=["Aplicações"],
  dependencies=[],
  responses={404: {"description": "Not found"}},
)


@router.get("/api/status")
def obter_status_api_arquivos():
  return {"status": "API de Aplicações está funcionando!"}

@router.get('/', response_model=List[Aplicacao])
def listar_aplicacoes():
  pass

@router.post('/')
def inserir_aplicacao():
  pass

@router.put('/')
def atualiar_aplicacao():
  pass

@router.get('/{id}', response_model=Aplicacao)
def obter_aplicacao_por_id(id: str):
  pass


@router.get('/token/{token}', response_model=Aplicacao)
def obter_aplicacao_por_token(token: str):
  pass

@router.get('/nome/{nome}', response_model=Aplicacao)
def pesquisar_aplicacoes_por_nome(nome: str):
  pass




def registrar_rotas(app):
  app.include_router(router)
