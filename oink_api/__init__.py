import os

from dotenv import load_dotenv
from oink_core.services import log_service as log


ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH_ARQUIVO_CONFIG = f"{ROOT_DIR}/.env.test"
AMBIENTE = os.getenv('OINK_ENV')

if AMBIENTE is None:
    log.ALERTA("Variável de ambiente OINK_ENV não existe.")
    AMBIENTE='DEV'

if AMBIENTE == 'PROD':
    PATH_ARQUIVO_CONFIG = f'{ROOT_DIR}/.env'

load_dotenv(PATH_ARQUIVO_CONFIG)
log.ALERTA("Ambiente:{}".format(os.getenv('OINK_ENV')))
