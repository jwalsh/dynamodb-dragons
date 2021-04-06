aws dynamodb  --region localhost --endpoint-url http://localhost:8000 \
    create-table \
    --table-name Users \
    --attribute-definitions AttributeName=UserId,AttributeType=S AttributeName=UserEmail,AttributeType=S \
    --key-schema AttributeName=UserId,KeyType=HASH \
    AttributeName=UserEmail,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 \
