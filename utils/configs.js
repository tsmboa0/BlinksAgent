import { MongoClient, ServerApiVersion } from "mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { TwitterApi } from "twitter-api-v2";

const mongoPass = encodeURIComponent(process.env.MONGO_PASS);
const MONGO_DB_URI = `mongodb+srv://tsmboa:${mongoPass}`+process.env.MONGO_DB_URI;


export const Client = new MongoClient(MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const collection = Client.db("BlinksAgent").collection("blinks");

export const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small"
});

export const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection:collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding"
});

export const xClient = new TwitterApi({
    appKey: process.env.APP_KEY ,
    appSecret: process.env.APP_SECRET,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

export const streamClient = new TwitterApi(process.env.BEARER_TOKEN_1);