import { Message } from "../../../../interfaces/Message";
import getUserFromId from "../../../../lib/getUserFromId";
import getUserIdFromToken from "../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../lib/mongodb";

export async function GET(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);
        const user = await getUserFromId(userId);

        const { messages } = await mongodb();

        const sentMessages = (await messages
            .find({ from: user.email })
            .toArray()) as unknown as Message[];
        const recviedMessages = (await messages
            .find({ to: user.email })
            .toArray()) as unknown as Message[];

        return new Response(
            JSON.stringify([...sentMessages, ...recviedMessages])
        );
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 404,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Bir şeyler ters gitti" }),
                { status: 500 }
            );
        }
    }
}

export async function POST(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);
        const user = await getUserFromId(userId);
        const body = {
            ...((await request.json()) as Message),
            from: user.email,
        };
        const { messages } = await mongodb();

        messages.insertOne(body);

        return new Response(
            JSON.stringify({ message: "Mesajınız başarıyla iletilmiştir." }),
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 404,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Bir şeyler ters gitti" }),
                { status: 500 }
            );
        }
    }
}
