const AWS = require("aws-sdk"),
      dynamodb = new AWS.DynamoDB({
          apiVersion: "2012-08-10",
          endpoint: "http://localhost:4566",
          region: "us-east-1"
      });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
console.log(dynamodb.endpoint);
