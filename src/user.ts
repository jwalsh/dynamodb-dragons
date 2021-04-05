import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({
  apiVersion: "2012-08-10",
  endpoint: "http://localhost:8000",
  region: "us-east-1",
});

console.log(client.config.endpoint());

client.listTables({}, (err, data) => {
  console.log("listTables");
  console.log(data);
});
