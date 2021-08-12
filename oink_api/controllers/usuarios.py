from fastapi import APIRouter

router = APIRouter(
  prefix="/v1/usuarios",
  tags=["Usuários"],
  dependencies=[],
  responses={404: {"description": "Not found"}},
)


@router.get("/api/status")
def obter_status_api_usuarios():
  return {"status": "API de usuários está funcionando!"}

@router.post("/")
def inserir_usuario(usuario):
  pass

@router.put("/")
def atualizar_usuario(usuario):
  pass

@router.get("/{usuario_id}")
def obter_usuario_por_id(id: int):
  return {"idUsuario": id}


def registrar_rotas(app):
  app.include_router(router)
