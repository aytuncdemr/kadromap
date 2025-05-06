"use client";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { User } from "../../../../interfaces/User";
import getTodayDate from "../../../../lib/getTodayDate";
import Button from "@/components/ui/button/Button";
import { Note } from "../../../../interfaces/Note";

export default function AddNote() {
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState<User | null>(null);

    const [note, setNote] = useState<Note>({
        title: "",
        content: "",
        date: getTodayDate(),
        fromEmail: "",
        fromName: "",
        departmentName: "",
        occupation: "",
    });
    useEffect(() => {
        async function getUser() {
            try {
                const { data } = await axios.get("/api/users", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
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

        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            setNote((prevMessage) => {
                return {
                    ...prevMessage,
                    fromEmail: user.email,
                    fromName: user.name + " " + user.lastName,
                    departmentName: user.departmentName,
                    occupation: user.occupation,
                };
            });
        }
    }, [user]);

    async function submitHandler(e: FormEvent) {
        e.preventDefault();

        try {
            const { data } = await axios.post("/api/notes", note, {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`,
                },
            });
            toast.success(data.message);
            setNote({
                title: "",
                content: "",
                date: getTodayDate(),
                fromEmail: "",
                fromName: "",
                departmentName: "",
                occupation: "",
            });
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
    return (
        <ComponentCard title="Not Ekle">
            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <Label>Başlık</Label>
                    <Input
                        required
                        onChange={(e) =>
                            setNote((prevMessage) => ({
                                ...prevMessage,
                                title: e.target.value,
                            }))
                        }
                        type="text"
                        value={note.title}
                    />
                </div>

                <div>
                    <Label>Not İçeriği</Label>
                    <div className="relative">
                        <textarea
                            required
                            onChange={(e) =>
                                setNote((prevMessage) => {
                                    return {
                                        ...prevMessage,
                                        content: e.target.value,
                                    };
                                })
                            }
                            value={note.content}
                            className={`min-h-[350px] w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 outline-none bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`}
                        ></textarea>
                    </div>
                </div>
                <Button type="submit">Gönder</Button>
            </form>
        </ComponentCard>
    );
}
