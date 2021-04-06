LAB_TARGET = lab3.zip

.PHONY: init run-dynamodb

# Tools
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


# Coursera
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
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-monitor/lab4.zip
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-members/lab5.zip
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-secure/lab6.zip
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-admin/lab7.zip
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-single/lab8.zip

setup: $(LAB_TARGET)

switch-worktree:
	docker container prune


# Local DynamoDB
run-aws: ## get-tools
	docker-compose up

list-tables: # 8000
	aws dynamodb --region us-east-1 --endpoint-url http://localhost:8000 list-tables

list-tables-lcl: # WIP 4566
	awslocal dynamodb list-tables

check-setup:
	npx ts-node src/index.ts


# Lab 3: Dragons
model.png: model.dot
	@dot -Tpng model.dot -o model.png

lab3.create-multiple-tables:
	node lab3/solution/create_multiple_tables.js
	$(MAKE) list-tables

lab3.seed-dragons: # create-multiple-tables
	node lab3/solution/seed_dragons.js

lab3.scan-dragons: # seed-dragons
	node lab3/solution/scan_dragons.js

lab3.query-dragon-stats:
	@./scripts/query-dragon-stats.sh | jq

data/denomalize-dragon-game.csv: $(wildcard lab3/resources/*.json) scripts/denomalize-dragon-game.sh
	@./scripts/denomalize-dragon-game.sh

denormalized-view: data/denomalize-dragon-game.csv
	@xsv stats data/denomalize-dragon-game.csv | xsv select field,type,min | xsv table


# Other labs
lab0.create-table:
	npx ts-node src/user.ts

lab0.create-modeling-table:
	npx ts-node src/modeling.ts

lab0.write-users:
	aws dynamodb  --region us-east-1 --endpoint-url http://localhost:8000  batch-write-item --request-items file://lab0/users.json

lab1.list-tables:
	$(MAKE) list-tables

lab1.create-table:
	./scripts/lab1-create-table-music.sh
