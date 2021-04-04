LAB_TARGET = lab3.zip

init:
	brew install asdf || true
	asdf plugin-add python || true
	asdf install python 3.8.5
	asdf local python 3.8.5
	$(MAKE) get-poetry

get-poetry:
	curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python3

$(LAB_TARGET):
	wget \
	https://s3.amazonaws.com/awsu-hosting/edx_dynamo/c9/dynamo-seed/lab3.zip
	unzip lab3.zip


setup: $(LAB_TARGET)
