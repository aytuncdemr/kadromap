import { ObjectId } from "mongodb";
import getUserIdFromToken from "../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../lib/mongodb";
import { User } from "../../../../interfaces/User";
import checkIsAdmin from "../../../../lib/checkIsAdmin";
import getUserFromId from "../../../../lib/getUserFromId";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const withPassword = searchParams.get("with-password");

        const userId = await getUserIdFromToken(request);
        const user = await getUserFromId(userId);

        if (withPassword !== "true") {
            const { password, ...userExcludedPassword } = user;

            return new Response(JSON.stringify(userExcludedPassword), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify(user), {
                status: 200,
            });
        }
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
        const body = (await request.json()) as User;

        const { users } = await mongodb();

        const userExist = await users.findOne({ email: body.email });

        if (userExist) {
            throw new Error("Bu emaili başka bir kullanıcı zaten kullanmakta.");
        }

        await users.insertOne(body);

        return new Response(
            JSON.stringify({ message: "Başarıyla kayıt olundu." }),
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

export async function PUT(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);
        const { _id, ...body } = (await request.json()) as User;

        const { users } = await mongodb();

        await users.findOneAndUpdate({ _id: userId }, { $set: body });

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

export async function DELETE(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);
        if (!(await checkIsAdmin(userId))) {
            throw new Error("Bu işlemi yapmak için yetkiniz yok");
        }

        const { _id } = (await request.json()) as User;
        const { users } = await mongodb();

        await users.findOneAndDelete({ _id: new ObjectId(_id) });

        return new Response(
            JSON.stringify({ message: "Kullanıcı başarıyla silindi" }),
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
