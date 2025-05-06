"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Message } from "../../../interfaces/Message";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import ComponentCard from "../common/ComponentCard";
import MessageTable from "../tables/MessageTable";
import { User } from "../../../interfaces/User";

export default function Messages() {
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[] | null>(null);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        async function getMessages() {
            try {
                const { data } = await axios.get("/api/messages", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                const { data: user } = await axios.get("/api/users", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                setUser(user);
                setMessages(data);
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

        if (!messages || !user) {
            getMessages();
        }

        const intervalId = setInterval(getMessages, 4000);

        return () => clearInterval(intervalId);
    }, []);

    if (!messages || !user) {
        return null;
    }

    return (
        <>
            <ComponentCard title="Alınan Mesajlar">
                <MessageTable
                    messages={messages
                        .filter((message) => message.to === user?.email)
                        .reverse()}
                    user={user}
                />
            </ComponentCard>
            <ComponentCard title="Gönderilen Mesajlar">
                <MessageTable
                    messages={messages
                        .filter((message) => message.fromEmail === user?.email)
                        .reverse()}
                    user={user}
                />
            </ComponentCard>
        </>
    );
}
