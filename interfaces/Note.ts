import { ObjectId } from "mongodb";

export interface Note {
    title: string;
    content: string;
    date: string;
    fromName: string;
    fromEmail:string;
    departmentName:string;
    occupation:string;
    _id?:ObjectId;
}
