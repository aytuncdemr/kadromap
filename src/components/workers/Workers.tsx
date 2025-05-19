"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { User } from "../../../interfaces/User";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import stringToRGB from "../../../lib/stringToRGB";
import { Department } from "../../../interfaces/Department";
import Form from "../form/Form";
import Select, { SingleValue } from "react-select";

export default function Workers() {
    const [openedWorker, setOpenedWorker] = useState<User | null>(null);
    const { isOpen, closeModal, openModal } = useModal(false);
    const [workers, setWorkers] = useState<User[] | null>(null);
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const authContext = useContext(AuthContext);

    function closeModalHandler() {
        closeModal();
        setOpenedWorker(null);
    }

    async function submitHandler(e: FormEvent) {
        e.preventDefault();

        try {
            const { data } = await axios.put("/api/users", openedWorker, {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`,
                },
            });
            toast.success(data.message);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error?.response?.data?.message || error.message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                console.error(error);
                toast.error("Beklenmeyen bir hata oluştu");
            }
        } finally {
            closeModalHandler();
        }
    }
    async function deleteWorkerHandler() {
        if (!openedWorker) return;

        try {
            const { data } = await axios.delete(`/api/users`, {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`,
                },
                data: openedWorker,
            });
            toast.success(data.message);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error?.response?.data?.message || error.message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                console.error(error);
                toast.error("Beklenmeyen bir hata oluştu");
            }
        } finally {
            closeModalHandler();
        }
    }
    useEffect(() => {
        async function getWorkers() {
            try {
                const { data } = await axios.get("/api/users/all", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                console.log(
                    data.map((worker: User) => ({
                        name: worker.name,
                        lastName: worker.lastName,
                        departmenName: worker.departmentName,
                        occupation: worker.occupation,
                    }))
                );
                setWorkers(data);
            } catch (error) {
                if (isAxiosError(error)) {
                    toast.error(
                        error?.response?.data?.message || error.message
                    );
                } else if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    console.error(error);
                    toast.error("Beklenmeyen bir hata oluştu");
                }
            }
        }
        if (!workers) {
            getWorkers();
        }

        const getWorkersID = setInterval(getWorkers, 4000);

        return () => {
            clearInterval(getWorkersID);
        };
    }, []);

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

        if (!departments) {
            getDepartments();
        }

        const getDepartmentsIntervalID = setInterval(getDepartments, 4000);

        return () => {
            clearInterval(getDepartmentsIntervalID);
        };
    }, []);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    İsim
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Departman
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Görev
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Şehir
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Telefon
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Kayıt Tarihi
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {workers
                                ?.map((worker) => (
                                    <TableRow
                                        onClick={() => {
                                            setOpenedWorker(worker);
                                            openModal();
                                        }}
                                        className="hover:bg-gray-100 duration-150 cursor-pointer"
                                        key={worker?._id?.toString()}
                                    >
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full">
                                                    <FontAwesomeIcon
                                                        icon={faUserCircle}
                                                        style={{
                                                            color: stringToRGB(
                                                                worker.name +
                                                                    worker.date
                                                            ),
                                                        }}
                                                        className="text-4xl xl:text-5xl"
                                                    ></FontAwesomeIcon>
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {worker.name}{" "}
                                                        {worker.lastName}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        {worker.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {worker.departmentName}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex -space-x-2">
                                                <p>{worker.occupation}</p>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {worker.city}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {worker.phone}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {worker.date}
                                        </TableCell>
                                    </TableRow>
                                ))
                                .reverse()}
                            {(workers?.length === 0 || !workers) && (
                                <tr>
                                    <td className="p-4 text-center">
                                        Görüntelenecek bir çalışan yok
                                    </td>
                                </tr>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {openedWorker && (
                <Modal
                    isOpen={isOpen}
                    onClose={closeModalHandler}
                    className="max-w-[700px] m-4"
                >
                    <Form
                        onSubmit={submitHandler}
                        className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
                    >
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                {openedWorker?.name} {openedWorker?.lastName}{" "}
                                <p className="mb-5  text-lg xl:text-xl font-medium text-gray-800 dark:text-white/90 lg:mb-8 flex flex-row justify-between">
                                    {openedWorker?.email}
                                </p>
                            </h4>
                        </div>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-3">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            İsim{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={
                                                openedWorker?.name +
                                                " " +
                                                openedWorker?.lastName
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            E-posta{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedWorker?.email}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Departman{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Select
                                            className="py-1"
                                            options={departments?.map(
                                                (department) => ({
                                                    value: department.name,
                                                    label: department.name,
                                                })
                                            )}
                                            value={
                                                openedWorker?.departmentName
                                                    ? {
                                                          label: openedWorker.departmentName,
                                                          value: openedWorker.departmentName,
                                                      }
                                                    : null
                                            }
                                            isClearable={false}
                                            onChange={(
                                                option: SingleValue<{
                                                    value: string;
                                                    label: string;
                                                }>
                                            ) => {
                                                if (!option) return;

                                                setOpenedWorker(
                                                    (prevWorker) => {
                                                        if (!prevWorker)
                                                            return null;
                                                        return {
                                                            ...prevWorker,
                                                            departmentName:
                                                                option.value,
                                                        };
                                                    }
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Görev{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            onChange={(e) =>
                                                setOpenedWorker(
                                                    (prevWorker) => {
                                                        if (!prevWorker) {
                                                            return null;
                                                        }
                                                        return {
                                                            ...prevWorker,
                                                            occupation:
                                                                e.target.value,
                                                        };
                                                    }
                                                )
                                            }
                                            value={openedWorker?.occupation}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Telefon{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedWorker?.phone}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Şehir{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedWorker?.city}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            UUID{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedWorker?._id
                                                ?.toString()
                                                ?.match(/.{1,4}/g)
                                                ?.join("-")}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Kayıt Tarihi{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedWorker?.date}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" type="submit">
                                Kaydet
                            </Button>
                            <Button
                                size="sm"
                                onClick={deleteWorkerHandler}
                                type="button"
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Çalışanı Sil
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={closeModalHandler}
                            >
                                Kapat
                            </Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </div>
    );
}
