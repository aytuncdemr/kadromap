import { Notification } from "../../../../interfaces/Notification";
import getUserFromId from "../../../../lib/getUserFromId";
import getUserIdFromToken from "../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../lib/mongodb";

export async function GET(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);

        const user = await getUserFromId(userId);

        const { messages, events, notes } = await mongodb();

        const messageNotifications = (
            await messages
                .find(
                    { to: user.email },
                    { projection: { title: 1, content: 1, date: 1 } }
                )
                .toArray()
        ).map((messageNotification) => ({
            ...messageNotification,
            type: "message",
        })) as unknown as Notification[];

        const eventNotifications = (
            await events
                .find({}, { projection: { title: 1, content: 1, date: 1 } })
                .toArray()
        ).map((messageNotification) => ({
            ...messageNotification,
            type: "event",
        })) as unknown as Notification[];

        const noteNotifications = (
            await notes
                .find({}, { projection: { title: 1, content: 1, date: 1 } })
                .toArray()
        ).map((messageNotification) => ({
            ...messageNotification,
            type: "note",
        })) as unknown as Notification[];

        const notifications: Notification[] = [
            ...messageNotifications,
            ...eventNotifications,
            ...noteNotifications,
        ]
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 30);

        return new Response(JSON.stringify(notifications), {
            status: 200,
        });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 400,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Beklenmeyen bir hata oluştu" }),
                { status: 500 }
            );
        }
    }
}
