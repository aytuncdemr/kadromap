import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = "kadromap";

interface MongoCache {
    client: MongoClient;
    db: Db;
}

declare global {
    let mongo: MongoCache | undefined;
}

const globalWithMongo = globalThis as typeof globalThis & {
    mongo?: MongoCache;
};

export async function mongodb() {
    if (!globalWithMongo.mongo) {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);

        globalWithMongo.mongo = { client, db };
    }

    const { client, db } = globalWithMongo.mongo;

    return {
        client,
        db,
        users: db.collection("users"),
        messages: db.collection("messages"),
        departments: db.collection("departments"),
        notes: db.collection("notes"),
        events: db.collection("events"),
    };
}
