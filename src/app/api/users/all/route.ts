import { User } from "../../../../../interfaces/User";
import checkIsAdmin from "../../../../../lib/checkIsAdmin";
import getUserIdFromToken from "../../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../../lib/mongodb";

export async function GET(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);

        if (!(await checkIsAdmin(userId))) {
            throw new Error("Bu api route için yetkiniz bulunmamaktadır.");
        }

        const { users } = await mongodb();
        const userDocuments = (await users
            .find({})
            .toArray()) as unknown as User[];

        const userDocumentsExcludedPasswords = userDocuments.map(
            (userDocument) => {
                if ("password" in userDocument) {
                    delete userDocument.password;
                }

                return userDocument;
            }
        );

        return new Response(JSON.stringify(userDocumentsExcludedPasswords), {
            status: 200,
        });
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
