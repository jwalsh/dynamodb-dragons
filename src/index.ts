// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
import {
  DynamoDB,
  PutItemInput,
  QueryInput,
  DeleteItemInput,
  UpdateItemInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from '@aws-sdk/util-dynamodb';

// import { md5 } from "md5";

(async () => {
  console.log("DynamoDB");
})();

const client = new DynamoDB({
  apiVersion: "2012-08-10",
  endpoint: "http://localhost:8000",
  region: "us-east-1",
});

console.log(client.config.endpoint());

// Types
export interface DragonGame {
  current_endurance: number;
  current_will_not_fight_credits: number;
  dragon_name: string;
  description: string;
  game_id: string;
}

export interface Dragon {
  damage: number;
  description: string;
  dragon_name: string;
  family: Family;
  location_city: string;
  location_country: LocationCountry;
  location_neighborhood: string;
  location_state: string;
  protection: number;
}

export enum Family {
  Black = "black",
  Blue = "blue",
  Green = "green",
  Red = "red",
}

export enum LocationCountry {
  Usa = "usa",
}

export interface DragonFamily {
  breath_attack: string;
  damage_modifier: number;
  description: string;
  family: string;
  protection_modifier: number;
}

export interface DragonFamilyAttack {
  breath_attack: string;
  description: string;
  extra_damage: number;
  range: number;
}

// List Tables
client.listTables({}, (_err, data) => {
  console.log("listTables");
  console.log(data);
});

// Query
const queryItemInput: QueryInput = {
  ExpressionAttributeValues: {
    ":name": {
      S: "Atlas",
    },
  },
  KeyConditionExpression: "dragon_name = :name",
  TableName: "dragon_stats",
};

client.query(queryItemInput, (_err, data) => {
  console.log("query: Atlas");
  console.log(data);
});

// Update
const updateItemInput: UpdateItemInput = {
  ExpressionAttributeNames: {
    "#N": "location_neighborhood",
    "#C": "location_city",
    "#S": "location_state",
    "#Y": "year", // new
    "#P": "password", // new
  },
  ExpressionAttributeValues: {
    ":n": {
      S: "wallingford",
    },
    ":c": {
      S: "seattle",
    },
    ":s": {
      S: "washington",
    },
    ":y": {
      N: "2021",
    },
    ":p": {
      S: "password",
    },
  },
  Key: {
    dragon_name: {
      S: "Omnitrek",
    },
  },
  ReturnValues: "ALL_NEW",
  TableName: "dragon_stats",
  UpdateExpression: "SET #N = :n, #C = :c, #S = :s, #Y = :y, #P = :p",
};

client.updateItem(updateItemInput, {}).then((output) => {
  console.log("updateItem: Omnitrek");
  console.log(output);
}, console.error);

// Put
// marshal to DynamoDB item key: {type: value}
const dragonLorem: Dragon = {
  dragon_name: "Lorem",
  damage: 1,
  description: "Lorem",
  family: Family.Red,
  location_city: "cambridge",
  location_neighborhood: "central",
  location_state: "massachusetts",
  location_country: LocationCountry.Usa,
  protection: 1,
};
console.log("Lorem", dragonLorem);

const putItemInput: PutItemInput = {
  Item: {
    dragon_name: {
      S: "Lorem",
    },
  },
  TableName: "dragon_stats",
};

client.putItem(putItemInput).then((data) => {
  console.log("putItem: Lorem");
  console.log(data);
}, console.error);

client.putItem({
  TableName: "dragon_stats",
  Item: marshall(dragonLorem)
}).then((data) => {
  console.log('marshalled putItem: Lorem');
  console.log(data);
});


// Delete
const deleteItemInput: DeleteItemInput = {
  Key: {
    dragon_name: {
      S: "Lorem",
    },
  },
  TableName: "dragon_stats",
};

client.deleteItem(deleteItemInput).then((output) => {
  console.log("deleteItem: Lorem");
  console.log(output);
}, console.error);
