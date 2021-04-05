// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { md5 } from "md5";

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

const params = {
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


// client.putItem({}).then((data) => {
//     console.log(data);
// })

client.deleteItem({
    Key: {
        "dragon_name": {
            S: "Acme"
        }
    },
    TableName: "dragon_stats"
}).then((output) => {
    console.log('deleteItem: Acme');
    console.log(output);
}, console.error)

const updateItemInput = {
    ExpressionAttributeNames: {
        "#N": "location_neighborhood",
        "#C": "location_city",
        "#S": "location_state",
        "#Y": "year", // new
        "#P": "password" // new
    },
    ExpressionAttributeValues: {
        ":n": {
            S: "wallingford"
        },
        ":c": {
            S: "Seattle"
        },
        ":s": {
            S: "Washington"
        },
        ":y": {
            N: "2021"
        },
        ":p": {
            S: "password"
        }
    },
    Key: {
        "dragon_name": {
            S: "Omnitrek"
        }
    },
    ReturnValues: "ALL_NEW",
    TableName: "dragon_stats",
    UpdateExpression: "SET #N = :n, #C = :c, #S = :s, #Y = :y, #P = :p"
};

client.updateItem(updateItemInput, {}).then((output) => {
    console.log('updateItem: Omnitrek')
    console.log(output);
}, (err) => console.log(err));