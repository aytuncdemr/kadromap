import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function getUserIdFromToken(request: Request) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Token değeri gönderilmedi.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        _id: string;
    };
    return new ObjectId(decoded._id);
}
