import { ObjectId } from "mongodb";
import getUserFromId from "./getUserFromId";

export default async function checkIsAdmin(_id: ObjectId) {
    const user = await getUserFromId(_id);

    if (user.departmentName === "Yönetim" && user.occupation === "Admin") {
        return true;
    }

    return false;
}
