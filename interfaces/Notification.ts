export interface Notification {
    title: string;
    date: string;
    content: string;
    type: "message" | "event" | "note";
}
