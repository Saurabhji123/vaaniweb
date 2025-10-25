import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vaaniweb';
const options = {
  appName: 'vaaniweb',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

console.log('MongoDB connecting to:', uri.substring(0, 20) + '...');

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().then((client) => {
      console.log('✅ MongoDB connected successfully');
      return client;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then((client) => {
    console.log('✅ MongoDB connected successfully');
    return client;
  }).catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  });
}

export default clientPromise;

export async function connectDB() {
  const client = await clientPromise;
  const db = client.db('vaaniweb');
  return { client, db };
}
