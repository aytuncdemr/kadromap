import { Note } from "../../../../interfaces/Note";
import getUserIdFromToken from "../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../lib/mongodb";

export async function GET(request: Request) {
    try {
        await getUserIdFromToken(request);

        const { notes } = await mongodb();

        const noteDocuments = (await notes
            .find({})
            .toArray()) as unknown as Note[];

        return new Response(JSON.stringify(noteDocuments));
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
        await getUserIdFromToken(request);
        const body = (await request.json()) as Note;

        const { notes } = await mongodb();

        notes.insertOne(body);

        return new Response(
            JSON.stringify({ message: "Notunuz başarıyla kayıt edilmiştir." }),
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
