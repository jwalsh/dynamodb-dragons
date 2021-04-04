# verbs, nouns, pronouns, adverbs, adjectives, prepositions, conjunctions, and interjections
aws dynamodb --endpoint-url http://localhost:8000 \
    create-table \
    --table-name Dictionary \
    --attribute-definitions AttributeName=Word,AttributeType=S AttributeName=Part,AttributeType=S AttributeName=Definition,AttributeType=S \
    --key-schema AttributeName=Word,KeyType=HASH AttributeName=Part,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --tags Key=Owner,Value=jwalsh
