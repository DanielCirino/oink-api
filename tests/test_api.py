def test_criar_aplicacao(app):
  assert app.app.title == 'Oink API'


def test_pagina_nao_encontrada(app):
  response= app.get('/url_que_nao_existe')
  assert response.status_code == 404