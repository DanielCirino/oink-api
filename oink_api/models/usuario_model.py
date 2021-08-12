from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Usuario(BaseModel):
  documento: str
  nome: str
  email: str
  senha: str
  status: str
  perfilAcesso: str
  dataCadastro: Optional[datetime]
  dataAtualizacao: Optional[datetime]
