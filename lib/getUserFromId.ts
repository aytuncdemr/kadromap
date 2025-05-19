import { ObjectId } from "mongodb";
import { mongodb } from "./mongodb";
import { User } from "../interfaces/User";

export default async function getUserFromId(_id: ObjectId) {
    const { users } = await mongodb();

    const user = (await users?.findOne({
        _id,
    })) as unknown as User;
    if (!user) {
        console.log(_id, " sistemde bulunamadı");
        throw new Error("Kullanıcı sistemde bulunamadı");
    }

    return user;
}
