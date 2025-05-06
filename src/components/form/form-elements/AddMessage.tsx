"use client";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import { ChevronDownIcon } from "../../../icons";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { User } from "../../../../interfaces/User";
import getTodayDate from "../../../../lib/getTodayDate";
import Button from "@/components/ui/button/Button";

export default function AddMessage() {
    const handleSelectChange = (value: string) => {
        setMessage((prevMessage) => ({ ...prevMessage, to: value }));
    };
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState<User | null>(null);
    const [userEmails, setUserEmails] = useState<
        { value: string; label: string }[] | null
    >(null);
    const [message, setMessage] = useState({
        title: "",
        content: "",
        date: getTodayDate(),
        fromEmail: "",
        to: "",
        departmentName: "",
        occupation: "",
        isRead: false,
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
        async function getEmails() {
            try {
                const { data } = await axios.get("/api/users/emails", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                setUserEmails(
                    data.map((email: string) => ({
                        label: email,
                        value: email,
                    }))
                );
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
        getEmails();
    }, []);

    useEffect(() => {
        if (user) {
            setMessage((prevMessage) => {
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
            if (!message.to) {
                throw new Error("Lütfen bir alıcı seçiniz");
            }

            const { data } = await axios.post("/api/messages", message, {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`,
                },
            });
            toast.success(data.message);
            setMessage({
                title: "",
                content: "",
                date: getTodayDate(),
                fromEmail: "",
                to: "",
                departmentName: "",
                occupation: "",
                isRead: false,
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
        <ComponentCard title="Yeni Mesaj Gönder">
            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <Label>Başlık</Label>
                    <Input
                        required
                        onChange={(e) =>
                            setMessage((prevMessage) => ({
                                ...prevMessage,
                                title: e.target.value,
                            }))
                        }
                        type="text"
                        value={message.title}
                    />
                </div>

                <div>
                    <Label>Gönderilen Kişi</Label>
                    <div className="relative">
                        <Select
                            value={message.to}
                            options={userEmails || []}
                            placeholder="Bir kişi seçiniz"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                            
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                        </span>
                    </div>
                </div>
                <div>
                    <Label>Mesaj</Label>
                    <div className="relative">
                        <textarea
                            required
                            onChange={(e) =>
                                setMessage((prevMessage) => {
                                    return {
                                        ...prevMessage,
                                        content: e.target.value,
                                    };
                                })
                            }
                            value={message.content}
                            className={`min-h-[350px] w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 outline-none bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`}
                        ></textarea>
                    </div>
                </div>
                <Button type="submit">Gönder</Button>
            </form>
        </ComponentCard>
    );
}
