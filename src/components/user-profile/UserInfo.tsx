"use client";

import { User } from "../../../interfaces/User";
import UserAddressCard from "./UserAddressCard";
import UserInfoCard from "./UserInfoCard";
import UserMetaCard from "./UserMetaCard";
import { AuthContext } from "@/context/AuthContext";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";

export default function UserInfo() {
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function getUserData() {
            try {
                const { data } = await axios.get(
                    "/api/users?with-password=true",
                    {
                        headers: {
                            Authorization: `Bearer ${authContext?.token}`,
                        },
                    }
                );

                setUser(data);
            } catch (error) {
                if (isAxiosError(error)) {
                    toast.error(error.response?.data.message || error.message);
                } else if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    console.log(error);
                    toast.error("Bir şeyler ters gitti");
                }
            }
        }

        if(!user){
            getUserData();
        }

        const intervalId = setInterval(() => getUserData(), 5000);

        return () => clearInterval(intervalId);
    }, []);

    if (!user) {
        return null;
    }

    return (
        <>
            <UserMetaCard user={user} />
            <UserInfoCard user={user} />
            <UserAddressCard user={user} />
        </>
    );
}
