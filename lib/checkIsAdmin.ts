import { ObjectId } from "mongodb";
import getUserFromId from "./getUserFromId";

export default async function checkIsAdmin(_id: ObjectId) {
    const admin = await getUserFromId(_id);

    if (admin.departmentName === "Yönetim" && admin.occupation === "Admin") {
        return true;
    }

    return false;
}
