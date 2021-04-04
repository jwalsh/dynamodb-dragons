LAB_TARGET = lab3.zip

.PHONY: init run-dynamodb

init:
	$(MAKE) get-poetry
	pip3 install awscli awscli-local

get-brew:
	curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | /bin/bash

get-tools: ## get-brew
	brew install asdf docker-compose gpg || true
	brew install --cask nosql-workbench || true

get-python: get-tools
	asdf plugin-add python || true
	asdf install python 3.8.5
	asdf local python 3.8.5

get-poetry: get-python
	curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python3

uninstall-docker:
	brew uninstall docker docker-compose

get-gpg: get-tools
	brew install --cask gpg-suite-no-mail

$(LAB_TARGET):
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-seed/lab3.zip
	unzip lab3.zip

setup: $(LAB_TARGET)

run-dynamodb: ## get-tools
	docker-compose up

list-tables:
	aws dynamodb list-tables --endpoint-url http://localhost:8000

create-multiple-tables:
	node lib/solution/create_multiple_tables.js

seed-dragons:
	node lib/solution/seed_dragons.js

scan-dragons:
	node lib/solution/scan_dragons.js
