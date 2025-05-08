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
import Select from "../form/Select";

export default function AddDepartment() {
    const [newDepartment, setNewDepartment] = useState<Department>({
        name: "",
        chief: {
            _id: null,
        },
        employees: [],
        date: getTodayDate(),
    });

    const [userEmails, setUserEmails] = useState<
        { value: string; label: string }[] | null
    >(null);
    const authContext = useContext(AuthContext);


    async function submitHandler(e:FormEvent){
        e.preventDefault();
        try{
            if(!newDepartment.chief._id){
                throw new Error("Yönetici kısmı boş bırakılamaz");
            }
            const {data} = await axios.post("/api/departments",newDepartment,{
                headers:{
                    "Authorization": `Bearer ${authContext?.token}`
                }
            });

            toast.success(data.message);

        }catch(error){
            if(isAxiosError(error)){
                toast.error(error.response?.data.message || error.message);
            }else if(error instanceof Error){
                toast.error(error.message);
            }else{
                console.log(error);
                toast.error("Bir şeyler ters gitti");
            }
        }finally{
            setNewDepartment({
                name: "",
                chief: {
                    _id: new ObjectId(0),
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
                            options={userEmails || []}
                            onChange={(e) => {
                                setNewDepartment((prevState) => ({
                                    ...prevState,
                                    chief: {
                                        _id: new ObjectId(e),
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
                <div>
                    <Label>
                        <div className="flex gap-4 items-center">
                            Çalışanlar
                            <Select
                                onChange={(e) =>
                                    setNewDepartment((prevDepartment) => ({
                                        ...prevDepartment,
                                        employees: [
                                            ...prevDepartment.employees,
                                            {
                                                email: userEmails.find(
                                                    (user) => user.value === e
                                                )?.label,
                                                _id: new ObjectId(e),
                                            },
                                        ],
                                    }))
                                }
                                placeholder="Ekle..."
                                className="border border-gray-100 rounded-lg text-base max-w-[150px]"
                                options={userEmails.filter((user) =>
                                    newDepartment.employees.find(
                                        (employee) =>
                                            employee.email === user.label
                                    )
                                        ? false
                                        : true
                                )}
                            ></Select>
                        </div>
                    </Label>
                    <div
                        className={`min-h-[350px] w-full relative rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 outline-none bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 flex gap-4`}
                    >
                        {newDepartment.employees.map((employee) => (
                            <p
                                key={employee._id.toString()}
                                onClick={() =>
                                    setNewDepartment((prevDepartment) => ({
                                        ...prevDepartment,
                                        employees:
                                            prevDepartment.employees.filter(
                                                (employeeWorking) =>
                                                    employeeWorking.email !==
                                                    employee.email
                                            ),
                                    }))
                                }
                                className="hover:text-red-500 cursor-pointer duration-150"
                            >
                                {employee.email}
                            </p>
                        ))}
                    </div>
                </div>
                <Button type="submit">Departmanı Ekle</Button>
            </form>
        </ComponentCard>
    );
}
