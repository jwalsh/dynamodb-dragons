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
	region: "localhost",
});

console.log(client.config.endpoint());

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql-B.html
client
	.createTable({
		TableName: "Items",
		AttributeDefinitions: [
			{
				AttributeName: "pk",
				AttributeType: "S",
			},
			{
				AttributeName: "sk",
				AttributeType: "S",
			},
		],
		KeySchema: [
			{
				AttributeName: "pk",
				KeyType: "HASH",
			},
			{
				AttributeName: "sk",
				KeyType: "RANGE",
			},
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 5,
			WriteCapacityUnits: 5,
		},
	})
	.then(console.log, console.error);

// HASH and RANGES by example
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
