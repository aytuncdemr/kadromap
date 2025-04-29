import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function mongodb() {
    if (!client || !db) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db("kadromap");
    }

    const users = db.collection("users");
    const messages = db.collection("messages");
    const departments = db.collection("departments");
    const notes = db.collection("notes");
    const events = db.collection("events");

    return { db, client, users, messages, departments, notes, events };
}
