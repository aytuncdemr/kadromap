import { ObjectId } from "bson";
import { Department } from "../../../../interfaces/Department";
import checkIsAdmin from "../../../../lib/checkIsAdmin";
import getDepartments from "../../../../lib/getDepartments";
import getUserIdFromToken from "../../../../lib/getUserIdFromToken";
import { mongodb } from "../../../../lib/mongodb";

export async function GET(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);

        if (!checkIsAdmin(userId)) {
            throw new Error("Bu api route için yetkiniz bulunmamaktadır.");
        }

        const departments = await getDepartments();
        return new Response(JSON.stringify(departments), {
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

        body.chief._id = new ObjectId(body.chief._id as ObjectId);
        delete body.chief.email;

        for (const employee of body.employees) {
            employee._id = new ObjectId(employee._id);
            delete employee.email;
        }

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

export async function PUT(request: Request) {
    try {
        const userId = await getUserIdFromToken(request);
        if (!checkIsAdmin(userId)) {
            throw new Error("Bu api route için yetkiniz bulunmamaktadır.");
        }

        const { departments } = await mongodb();

        const { _id, ...body } = (await request.json()) as Department;

        body.chief._id = new ObjectId(body.chief._id as ObjectId);
        delete body.chief.email;

        for (const employee of body.employees) {
            employee._id = new ObjectId(employee._id);
            delete employee.email;
        }

        departments.findOneAndUpdate(
            { _id: new ObjectId(_id) },
            { $set: body }
        );

        return new Response(
            JSON.stringify({ message: "Departman başarıyla güncellendi" }),
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
