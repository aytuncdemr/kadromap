import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

let db: Db | null = null;

export async function mongodb() {
    if (!db) {
        await client.connect();
        db = client.db("kadromap");
    }

    const users = db.collection("users");
    const messages = db.collection("messages");
    const departments = db.collection("departments");
    const notes = db.collection("notes");
    const events = db.collection("events");

    return { db, users, messages, departments, notes, events };
}
