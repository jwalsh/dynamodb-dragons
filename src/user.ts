import {
  DynamoDB,
  CreateTableInput,
  PutItemInput,
  QueryInput,
  DeleteItemInput,
  UpdateItemInput,
  BillingModeSummary,
} from "@aws-sdk/client-dynamodb";
import { marshall } from '@aws-sdk/util-dynamodb';

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

client.createTable({
  TableName: 'Users',
  AttributeDefinitions: [{
    AttributeName: "email",
    AttributeType: "S",
  }],
  KeySchema: [{
    AttributeName: "email",
    KeyType: "HASH"
  }],
  BillingMode: "PAY_PER_REQUEST",
}).then((data) => {
  console.log(data)
}, console.error);
