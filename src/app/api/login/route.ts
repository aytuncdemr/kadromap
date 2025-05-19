import { LoginData } from "../../../../interfaces/LoginData";
import { mongodb } from "../../../../lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginData;

        const { users } = await mongodb();

        const user = await users.findOne({
            email: body.email,
            password: body.password,
        });

        if (user) {
            const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET as string,
                { expiresIn: "15d" }
            );

            return new Response(JSON.stringify(token), { status: 200 });
        } else {
            throw new Error("Kullanıcı adı veya şifre hatalı");
        }
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 404,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Bir şeyler ters gitti." }),
                { status: 500 }
            );
        }
    }
}
