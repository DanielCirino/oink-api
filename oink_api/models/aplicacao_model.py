from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Aplicacao(BaseModel):
  id: str
  nome: str
  apiKey: str
  status: str
  tipo: str
  dataCadastro: Optional[datetime]
  dataAtualizacao: Optional[datetime]
