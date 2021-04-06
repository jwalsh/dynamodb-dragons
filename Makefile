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
	aws dynamodb --region localhost --endpoint-url http://localhost:8000 list-tables

list-tables-lcl: # WIP 4566
	awslocal dynamodb list-tables

check-setup:
	npx ts-node src/index.ts

update-continuous-backups: # WIP
	awslocal dynamodb update-continuous-backups \
	--table-name MusicCollection \
	--point-in-time-recovery-specification PointInTimeRecoveryEnabled=True

export-table-to-point-in-time: # WIP
	awslocal dynamodb export-table-to-point-in-time \
	--table-arn arn:aws:dynamodb:us-west-2:123456789012:table/MusicCollection \
	--s3-bucket ddb-export-musiccollection \
	--s3-prefix 2020-Nov \
	--export-format DYNAMODB_JSON \
	--export-time 1604632434 \
	--s3-sse-algorithm AES256

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

lab3.run: lab3.create-multiple-tables lab3.seed-dragons lab3.scan-dragons

lab3.query-dragon-stats:
	aws dynamodb --endpoint-url http://localhost:8000 \
	query \
	--table-name dragon_stats \
	--key-condition-expression "dragon_name = :name" \
	--expression-attribute-values  '{":name":{"S":"Atlas"}}' | jq '.Items[0]'

data/denomalize-dragon-game.csv: $(wildcard lab3/resources/*.json) scripts/denomalize-dragon-game.sh
	@./scripts/denomalize-dragon-game.sh

denormalized-view: data/denomalize-dragon-game.csv
	@xsv stats data/denomalize-dragon-game.csv | xsv select field,type,min | xsv table

lab3.clean: list-tables
	aws --endpoint-url http://localhost:8000 --region localhost dynamodb delete-table --table-name dragon_bonus_attack || true
	aws --endpoint-url http://localhost:8000 --region localhost dynamodb delete-table --table-name dragon_current_power || true
	aws --endpoint-url http://localhost:8000 --region localhost dynamodb delete-table --table-name dragon_family || true
	aws --endpoint-url http://localhost:8000 --region localhost dynamodb delete-table --table-name dragon_stats || true

# Other labs
lab0.create-table:
	npx ts-node src/user.ts

create-user-profiles:
	$(MAKE) lab0.create-table

lab0.create-modeling-table:
	npx ts-node src/modeling.ts

lab0.write-users:
	aws dynamodb --region localhost --endpoint-url http://localhost:8000  batch-write-item --request-items file://lab0/users.json

lab1.list-tables:
	$(MAKE) list-tables

lab1.create-table:
	./scripts/lab1-create-table-music.sh

.FORCE:
