import { ObjectId } from "mongodb";

export interface Department {
    name: string;
    employees: { _id: ObjectId }[];
    chief: { _id: ObjectId };
    date: string;
}
