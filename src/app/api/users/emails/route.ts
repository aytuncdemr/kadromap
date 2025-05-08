import { User } from "../../../../../interfaces/User";
import getUserFromId from "../../../../../lib/getUserFromId";
import getUserIdFromToken from "../../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../../lib/mongodb";

export async function GET(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);

        const user = await getUserFromId(userId);

        const { users } = await mongodb();

        const emails = ((await users.find({}).toArray()) as User[])
            .filter((userDocument: User) => userDocument.email !== user.email)
            .map((user) => ({ email: user.email, _id: user._id }));

        return new Response(JSON.stringify(emails), { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 404,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Bir şeyler ters gitti" }),
                {
                    status: 500,
                }
            );
        }
    }
}
