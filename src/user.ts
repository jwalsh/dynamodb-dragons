import {
  DynamoDB,
  CreateTableInput,
  PutItemInput,
  QueryInput,
  DeleteItemInput,
  UpdateItemInput,
  BillingModeSummary,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

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

client
  .createTable({
    TableName: "Users",
    AttributeDefinitions: [
      {
        AttributeName: "email",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "email",
        KeyType: "HASH",
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  })
  .then((data) => {
    console.log(data);
  }, console.error);

client
  .createTable({
    TableName: "Account",
    AttributeDefinitions: [
      {
        AttributeName: "email",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "email",
        KeyType: "HASH",
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  })
  .then(console.log, console.error);

client
  .createTable({
    TableName: "Catalog",
    AttributeDefinitions: [
      {
        AttributeName: "sku",
        AttributeType: "S",
      },
      {
        AttributeName: "brand",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "brand",
        KeyType: "RANGE",
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  })
  .then(console.log, console.error);

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-1.html
client
  .createTable({
    TableName: "Music",
    AttributeDefinitions: [
      {
        AttributeName: "Artist",
        AttributeType: "s",
      },
      {
        AttributeName: "Title",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "Artist",
        KeyType: "HASH",
      },
      {
        AttributeName: "Title",
        KeyType: "RANGE",
      },
    ],
  })
  .then(console.log, console.error);

client
  .createTable({
    AttributeDefinitions: [
      {
        AttributeName: "Deleted",
        AttributeType: "S",
      },
      {
        AttributeName: "Id",
        AttributeType: "S",
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "Deleted-index",
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          WriteCapacityUnits: 5,
          ReadCapacityUnits: 5,
        },
        KeySchema: [
          {
            KeyType: "HASH",
            AttributeName: "Deleted",
          },
        ],
      },
    ],
    ProvisionedThroughput: {
      WriteCapacityUnits: 5,
      ReadCapacityUnits: 5,
    },
    TableName: "Items",
    KeySchema: [
      {
        KeyType: "HASH",
        AttributeName: "Id",
      },
    ],
  })
  .then(console.log, console.error);
