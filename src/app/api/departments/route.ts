import { Department } from "../../../../interfaces/Department";
import checkIsAdmin from "../../../../lib/checkIsAdmin";
import getUserIdFromToken from "../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../lib/mongodb";

export async function GET(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);

        if (!checkIsAdmin(userId)) {
            throw new Error("Bu api route için yetkiniz bulunmamaktadır.");
        }

        const { departments } = await mongodb();

        const departmentDocuments = (await departments
            .find({})
            .toArray()) as unknown as Department[];

        return new Response(JSON.stringify(departmentDocuments), {
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

export async function POST(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);
        const body = (await request.json()) as Department;
        if (!checkIsAdmin(userId)) {
            throw new Error("Bu api route için yetkiniz bulunmamaktadır.");
        }

        const { departments } = await mongodb();

        departments.insertOne(body);

        return new Response(
            JSON.stringify({ message: "Departman başarıyla eklenmiştir." }),
            {
                status: 200,
            }
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
