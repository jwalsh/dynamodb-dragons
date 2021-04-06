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

const clean = client.deleteTable({
  TableName: "Users",
});

const setup = client
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
  readonly email: string;
  password: string;
  fullName?: string;
  createdDate: Date;
  access?: string[];
  todos?: string[];
  age?: number;
}

class AppUser implements User {
  createdDate = new Date();
  todos = [];
  access = [];
  email;
  password;
  lastLogin = new Date();

  constructor(emailInput: string, passwordInput: string, age?: number) {
    this.email = emailInput.toLowerCase();
    this.password = passwordInput.toUpperCase();
  }

  login(passwordInput: string) {
    if (passwordInput.toUpperCase() == this.password) {
      const lastLogin = new Date();
      this.lastLogin = lastLogin;
      // this.access.push(lastLogin.toString());
    } else {
      throw new Error("InvalidLogin");
    }
  }
}

const jason = new AppUser("j@wal.sh", "P@s5W0rd");
console.log("AppUser", jason);
// console.log(jason.login('password'));
console.log(jason.login("P@s5W0rd"));

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
