import {
  DynamoDB,
  CreateTableInput,
  GetItemInput,
  PutItemInput,
  QueryInput,
  DeleteItemInput,
  UpdateItemInput,
  BillingModeSummary,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

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
  })
  .then((data) => {
    console.log(data);
  }, console.error);

interface User {
  email: string;
  password: string;
  access: string[];
  todos: string[];
  age: number;
}

client
  .putItem({
    TableName: "Users",
    Item: marshall({
      email: "j@wal.sh",
      passsword: "loremipsum",
      access: [],
      todos: [],
      age: 100,
    }),
  })
  .then(console.log, console.error);

client
  .getItem({
    TableName: "Users",
    Key: marshall({
      email: "j@wal.sh",
    }),
  })
  .then((data) => {
    console.log(data);
    // const user= unmarshall(data.Item);
    // user.access.push(new Date());
  });
