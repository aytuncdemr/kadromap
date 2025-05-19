import checkIsAdmin from "../../../../../lib/checkIsAdmin";
import getUserIdFromToken from "../../../../../lib/getUserIdFromToken";

export async function GET(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);
        const isAdmin = await checkIsAdmin(userId);

        return new Response(isAdmin ? "Admin" : "User", { status: 200 });
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
