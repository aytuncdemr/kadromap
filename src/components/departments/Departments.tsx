"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { Department } from "../../../interfaces/Department";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
} from "@mui/material";
import Form from "../form/Form";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";
import cloneDeep from "lodash/cloneDeep";
import { ObjectId } from "bson";

export default function Departments() {
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const authContext = useContext(AuthContext);

    const [editingDepartment, setEditingDepartment] =
        useState<Department | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [userEmails, setUserEmails] = useState<
        { value: string; label: string }[] | null
    >(null);

    async function updateDepartmentHandler(e: FormEvent) {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                "/api/departments",
                editingDepartment,
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
                toast.error("Bir şeyler ters gitti");
                console.log(error);
            }
        }finally{
            setEditingDepartment(null);
            setIsOpen(false);
        }
    }

    useEffect(() => {
        async function getDepartments() {
            try {
                const { data } = await axios.get("/api/departments", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                setDepartments(data);
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
        const getUserEmailsIntervalID = setInterval(getUserEmails,4000);
        const getDepartmentsIntervalID = setInterval(getDepartments,4000);

        return () => {
            clearInterval(getUserEmailsIntervalID);
            clearInterval(getDepartmentsIntervalID);
        }
    }, []);

    if (!userEmails) {
        return null;
    }

    function handleChiefEmailChange(value: string) {
        setEditingDepartment((prevState) => {
            if (!prevState) {
                return null;
            }

            const newState = cloneDeep(prevState);
            newState.chief.email = userEmails?.find(
                (user) => user.value === value
            )?.label;
            newState.chief._id = new ObjectId(value);
            return newState;
        });
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <TableContainer component={Paper} style={{ marginTop: 20 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Departman</TableCell>
                                    <TableCell>Yönetici</TableCell>
                                    <TableCell>Kuruluş Tarihi</TableCell>
                                    <TableCell>Üyeler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {departments?.map((department) => (
                                    <TableRow
                                        className="hover:bg-gray-200 cursor-pointer duration-150"
                                        key={department._id?.toString()}
                                        onClick={() => {
                                            setIsOpen(true);
                                            setEditingDepartment(department);
                                        }}
                                    >
                                        <TableCell>{department.name}</TableCell>
                                        <TableCell>
                                            {department.chief.email}
                                        </TableCell>
                                        <TableCell>{department.date}</TableCell>
                                        <TableCell>
                                            {department.employees
                                                .slice(0, 2)
                                                .map((employee) => (
                                                    <p
                                                        key={employee._id.toString()}
                                                    >
                                                        {employee.email}
                                                    </p>
                                                ))}
                                            <p>(Devamını Görüntüle)</p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            {editingDepartment && (
                <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    className="max-w-[700px] mx-auto mt-[20vh] p-6 lg:p-10"
                >
                    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900  lg:p-11">
                        <Form onSubmit={updateDepartmentHandler}>
                            <div>
                                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                                    Departmanı Güncelle
                                </h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Departmanı güncellemek için aşağıdaki
                                    bilgileri doldurunuz
                                </p>
                            </div>
                            <div className="mt-8">
                                <div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Departman İsmi
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={editingDepartment?.name}
                                            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                            onChange={(e) =>
                                                setEditingDepartment(
                                                    (prevState) => {
                                                        if (!prevState) {
                                                            return null;
                                                        }

                                                        return {
                                                            ...prevState,
                                                            name: e.target
                                                                .value,
                                                        };
                                                    }
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Yönetici /{" "}
                                        {editingDepartment.chief.email}
                                    </label>
                                    <div className="relative">
                                        <div className="relative">
                                            <Select
                                                defaultValue=""
                                                options={userEmails || []}
                                                placeholder="Bir kişi seçiniz"
                                                onChange={
                                                    handleChiefEmailChange
                                                }
                                                className="dark:bg-dark-900"
                                            />
                                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                <ChevronDownIcon />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Kuruluş Tarihi
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="event-start-date"
                                            type="date"
                                            value={editingDepartment?.date}
                                            disabled
                                            readOnly
                                            className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Çalışanlar ({editingDepartment.employees.length})
                                    </label>
                                    <div className="relative grid grid-cols-3 gap-4">
                                        {editingDepartment.employees.map(
                                            (employee) => {
                                                return (
                                                    <div
                                                        key={employee._id.toString()}
                                                        onClick={() =>
                                                            setEditingDepartment(
                                                                (prevState) => {
                                                                    if (
                                                                        !prevState
                                                                    ) {
                                                                        return null;
                                                                    }
                                                                    const newState =
                                                                        cloneDeep(
                                                                            prevState
                                                                        );

                                                                    return {
                                                                        ...newState,
                                                                        employees:
                                                                            newState.employees.filter(
                                                                                (
                                                                                    activeEmployee
                                                                                ) =>
                                                                                    activeEmployee.email !==
                                                                                    employee.email
                                                                            ),
                                                                    };
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <p className="hover:text-red-500 duration-150 cursor-pointer">
                                                            {employee.email}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    type="button"
                                    className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                                >
                                    Kapat
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            )}
        </div>
    );
}
