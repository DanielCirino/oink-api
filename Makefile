install:
	pip install -e .['dev']

uninstall:
	pip uninstall oink-api

test_cov:
	 export OINK_ENV=DEV && pytest tests/ -v --cov=oink_api

test:
	 export OINK_ENV=DEV && pytest tests/ -v

cleanup:
	rm -r .pytest_cache && echo "Limpeza concluída..."

run:
	uvicorn oink_api.app:criar_aplicacao --reload