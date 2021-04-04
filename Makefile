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
	# unzip lab3.zip

get-all-labs:
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-create/lab1.zip
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-update/lab2.zip
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-seed/lab3.zip


setup: $(LAB_TARGET)

run-aws: ## get-tools
	docker-compose up

list-tables: # 8000
	aws dynamodb --endpoint-url http://localhost:8000 list-tables

list-tables-lcl: # WIP 4566
	awslocal dynamodb list-tables

check-setup:
	npx ts-node src/index.ts

create-multiple-tables:
	node lab3/solution/create_multiple_tables.js
	$(MAKE) list-tables

seed-dragons: # create-multiple-tables
	node lab3/solution/seed_dragons.js

scan-dragons: # seed-dragons
	node lab3/solution/scan_dragons.js

data/denomalize-dragon-game.csv: $(wildcard lab3/resources/*.json) scripts/denomalize-dragon-game.sh
	@./scripts/denomalize-dragon-game.sh

denormalized-view: data/denomalize-dragon-game.csv
	@xsv stats data/denomalize-dragon-game.csv | xsv select field,type,min | xsv table

# Additional support for previous labs

lab1.list-tables:
	$(MAKE) list-tables

lab1.create-table:
	./scripts/lab1-create-table-music.sh
