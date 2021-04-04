aws dynamodb --endpoint-url http://localhost:8000 \
    query \
    --table-name dragon_stats \
    --key-condition-expression "dragon_name = :name" \
    --expression-attribute-values  '{":name":{"S":"Atlas"}}'
