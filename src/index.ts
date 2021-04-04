// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
import { DynamoDB } from "@aws-sdk/client-dynamodb"

(async () => {
    console.log('DynamoDB')
})();

const client = new DynamoDB({
    apiVersion: "2012-08-10",
    endpoint: "http://localhost:8000",
    region: "us-east-1"
});

console.log(client.config.endpoint());

client.listTables({}, (err, data) => {
    console.log('listTables')
    console.log(data);
})

var params = {
    ExpressionAttributeValues: {
        ":name": {
            S: "Atlas"
        }
    },
    KeyConditionExpression: "dragon_name = :name",
    TableName: "dragon_stats"
};

client.query(params, (err, data) => {
    console.log('query: Atlas')
    console.log(data);
})