import checkIsAdmin from "../../../../lib/checkIsAdmin";
import getUserFromId from "../../../../lib/getUserFromId";
import getUserIdFromToken from "../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../lib/mongodb";

export async function GET(request: Request) {
    try {
        await getUserIdFromToken(request);

        const { events } = await mongodb();

        const eventDocuments = (await events
            .find({})
            .toArray()) as unknown as Event[];

        return new Response(JSON.stringify(eventDocuments));
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
            ...((await request.json()) as Event),
            from: user.email,
        };

        if (!(await checkIsAdmin(userId))) {
            throw new Error("Bu api route için yetkiniz bulunmamaktadır.");
        }

        const { events } = await mongodb();

        events.insertOne(body);

        return new Response(
            JSON.stringify({
                message: "Etkinlik başarıyla takvime eklenmiştir.",
            }),
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
