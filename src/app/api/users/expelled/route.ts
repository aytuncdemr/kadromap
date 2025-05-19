import { ObjectId } from "bson";
import getUserIdFromToken from "../../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../../lib/mongodb";

export async function PUT(request: Request) {
    try {
        await getUserIdFromToken(request);
        const { _id } = await request.json();

        const { users } = await mongodb();

        await users.findOneAndUpdate(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    departmentName: "Atama Yapılmamış",
                    occupation: "Atama yapılmamış",
                },
            }
        );

        return new Response(
            JSON.stringify({ message: "Değişiklikler başarıyla kaydedildi" }),
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
                { status: 200 }
            );
        }
    }
}
