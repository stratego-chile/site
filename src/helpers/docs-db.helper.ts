import { DocsArticleDocument } from '@stratego/schemas/docs-article'
import { MongoClient, type MongoClientOptions } from 'mongodb'

let mongoClient!: MongoClient

let clientPromise!: Promise<MongoClient>

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-var
  var _mongoDocsDBClientPromise: Promise<MongoClient>
}

function getConnection() {
  const uri = process.env.DOCS_MONGO_URI

  const options = Object.freeze<MongoClientOptions>({
    rejectUnauthorized: true,
  })

  return new MongoClient(uri, options)
}

if (!process.env.DOCS_MONGO_URI)
  throw new Error('Please add your Mongo URI to your environment variables')

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoDocsDBClientPromise) {
    mongoClient = getConnection()
    global._mongoDocsDBClientPromise = mongoClient.connect()
  }
  clientPromise = global._mongoDocsDBClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  mongoClient = getConnection()
  clientPromise = mongoClient.connect()
}

export const createDocsDBConnection = async () =>
  (await clientPromise)
    .db(process.env.DOCS_MONGO_DB)
    .collection<DocsArticleDocument>(process.env.DOCS_MONGO_COLLECTION)
