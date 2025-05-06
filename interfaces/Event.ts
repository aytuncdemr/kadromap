import { ObjectId } from "mongodb";

export interface Event{
    content:string;
    title:string;
    date:string;
    _id?:ObjectId;
}