import { ObjectId } from "mongodb";

export interface Message {
    title: string;
    content: string;
    date: string;
    fromEmail: string;
    fromName: string;
    to: string;
    departmentName: string;
    occupation: string;
    isRead: boolean;
    _id?: ObjectId;
}
