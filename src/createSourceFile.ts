import * as ts from 'typescript';

const node = ts.createSourceFile(
  '_.ts',`
  import { DynamoDB } from "@aws-sdk/client-dynamodb";
`,
  ts.ScriptTarget.Latest
);

console.log(node);