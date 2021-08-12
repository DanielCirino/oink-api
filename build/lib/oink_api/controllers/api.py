from fastapi import APIRouter

router = APIRouter(
  prefix="/v1/api",
  tags=["API"],
  dependencies=[],
  responses={404: {"description": "Not found"}},
)


@router.get("/status")
async def obter_status_api():
  return {"status": "O pai tá ON!"}


def registrar_rotas(app):
  app.include_router(router)
