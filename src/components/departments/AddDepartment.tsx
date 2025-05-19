"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import getTodayDate from "../../../lib/getTodayDate";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Department } from "../../../interfaces/Department";
import { ObjectId } from "bson";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import Select, { SingleValue } from "react-select";

export default function AddDepartment() {
    const [newDepartment, setNewDepartment] = useState<Department>({
        name: "",
        chief: {
            //@ts-expect-error
            _id: null,
        },
        employees: [],
        date: getTodayDate(),
    });

    const [userEmails, setUserEmails] = useState<
        { value: string; label: string }[] | null
    >(null);
    const authContext = useContext(AuthContext);

    async function submitHandler(e: FormEvent) {
        e.preventDefault();
        try {
            if (!newDepartment.chief._id) {
                throw new Error("Lütfen bir yönetici seçiniz");
            }
            const { data } = await axios.post(
                "/api/departments",
                newDepartment,
                {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                }
            );

            toast.success(data.message);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Bir şeyler ters gitti");
            }
        } finally {
            setNewDepartment({
                name: "",
                chief: {
                    //@ts-expect-error
                    _id: null,
                },
                employees: [],
                date: getTodayDate(),
            });
        }
    }

    useEffect(() => {
        async function getUserEmails() {
            try {
                const { data } = await axios.get("/api/users/emails", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                setUserEmails(
                    data.map((user: { email: string; _id: ObjectId }) => ({
                        label: user.email,
                        value: user._id.toString(),
                    }))
                );
            } catch (error) {
                if (isAxiosError(error)) {
                    toast.error(error.response?.data.message || error.message);
                } else if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Bir şeyler ters gitti");
                    console.log(error);
                }
            }
        }
        if (!userEmails) {
            getUserEmails();
        }
        const getUserEmailsIntervalID = setInterval(getUserEmails, 4000);

        return () => {
            clearInterval(getUserEmailsIntervalID);
        };
    }, []);

    if (!userEmails) {
        return null;
    }

    return (
        <ComponentCard title="Yeni Departman Ekle">
            <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>Departman İsmi</Label>
                        <Input
                            onChange={(e) =>
                                setNewDepartment((prevState) => ({
                                    ...prevState,
                                    name: e.target.value,
                                }))
                            }
                            required
                            type="text"
                            value={newDepartment.name}
                        />
                    </div>

                    <div>
                        <Label>Yönetici</Label>
                        <Select
                            value={{
                                label:
                                    userEmails.find(
                                        (user) =>
                                            user.value ===
                                            newDepartment.chief._id?.toString()
                                    )?.label || "",
                                value:
                                    newDepartment.chief._id?.toString() || "",
                            }}
                            options={userEmails}
                            onChange={(
                                option: SingleValue<{
                                    label: string | undefined;
                                    value: string;
                                }>
                            ) => {
                                setNewDepartment((prevState) => ({
                                    ...prevState,
                                    chief: {
                                        _id: new ObjectId(option?.value),
                                    },
                                }));
                            }}
                        />
                    </div>

                    <div>
                        <Label>Kuruluş Tarihi</Label>
                        <Input
                            required
                            type="text"
                            disabled
                            value={newDepartment.date}
                        />
                    </div>
                </div>
               
                <Button type="submit">Departmanı Ekle</Button>
            </form>
        </ComponentCard>
    );
}
