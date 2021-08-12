import os

import pytest
from fastapi.testclient import TestClient
from oink_api.app import criar_aplicacao


os.environ["OINK_ENV"] = 'DEV'
@pytest.fixture(scope="module")
def app():
    """
    Cria uma instância principal do aplicativo para ser utilizada em todos dos testes
    :return: uma aplicação flask
    """

    return TestClient(criar_aplicacao())
