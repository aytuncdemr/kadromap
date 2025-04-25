import { ObjectId } from "mongodb";

export interface User {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    password?: string;
    city: string;
    occupation: string;
    departmentName: string;
    date: string;
    _id: ObjectId;
}
