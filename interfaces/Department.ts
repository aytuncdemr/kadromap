import { ObjectId } from "mongodb";

export interface Department {
    name: string;
    employees: { _id: ObjectId; email?: string }[];
    chief: { _id: ObjectId; email?: string };
    date: string;
    _id?: ObjectId;
}
