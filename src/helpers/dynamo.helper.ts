import {
  DynamoDBClient,
  type DynamoDBClientConfig,
  type QueryCommand,
  type ScanCommand,
} from '@aws-sdk/client-dynamodb'

export const createDynamoClient = (config?: DynamoDBClientConfig) =>
  new DynamoDBClient(
    config ?? {
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.DOCS_DYNAMODB_ACCESS_KEY_ID,
        secretAccessKey: process.env.DOCS_DYNAMODB_SECRET_ACCESS_KEY,
      },
    }
  )

export const getDynamoCommandItems = async (
  command: ScanCommand | QueryCommand,
  dynamoClient?: DynamoDBClient
) => {
  const { Items: items } = await (dynamoClient ?? createDynamoClient()).send(
    command
  )
  return items
}
