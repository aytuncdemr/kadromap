import React, { useContext, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Message } from "../../../interfaces/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { User } from "../../../interfaces/User";

export default function BasicTableOne({
    messages,
    user,
}: {
    user: User;
    messages: Message[];
}) {
    const { isOpen, closeModal, openModal } = useModal(false);
    const [openedMessage, setOpenedMessage] = useState<Message | null>(null);
    const authContext = useContext(AuthContext);

    async function setMessageRead(message: Message) {
        try {
            await axios.put(
                "/api/messages",
                { ...message, isRead: true },
                {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                }
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
                                    Başlık
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
                                    Durum
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Tarih
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {messages.map((message) => (
                                <TableRow
                                    onClick={() => {
                                        setOpenedMessage(message);
                                        openModal();
                                        if (user.email === message.to) {
                                            setMessageRead(message);
                                        }
                                    }}
                                    className="hover:bg-gray-100 duration-150 cursor-pointer"
                                    key={message?._id?.toString()}
                                >
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full">
                                                <FontAwesomeIcon
                                                    icon={faUserCircle}
                                                    style={{
                                                        color: stringToRGB(
                                                            message.fromName +
                                                                message.date
                                                        ),
                                                    }}
                                                    className="text-4xl xl:text-5xl"
                                                ></FontAwesomeIcon>
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {message.fromName}
                                                </span>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {message.fromEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {message.title}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            <p>{message.departmentName}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                message.isRead
                                                    ? "success"
                                                    : "warning"
                                            }
                                        >
                                            {message.isRead
                                                ? "Okundu"
                                                : "Okunmamış"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {message.date}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {messages.length === 0 && (
                                <tr>
                                    <td className="p-4 text-center">
                                        Görüntelenecek bir mesaj yok
                                    </td>
                                </tr>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {openedMessage && (
                <Modal
                    isOpen={isOpen}
                    onClose={closeModal}
                    className="max-w-[700px] m-4"
                >
                    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                {openedMessage.fromName} - Gönderilen Mesaj
                            </h4>
                            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 lg:mb-7"></p>
                        </div>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-3">
                                <h5 className="mb-5 text-lg xl:text-xl font-medium text-gray-800 dark:text-white/90 lg:mb-8 flex flex-row justify-between">
                                    <p>{openedMessage.title}</p>
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Gönderen İsim{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedMessage.fromName}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Gönderen E-posta{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedMessage.fromEmail}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Departman{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedMessage.departmentName}
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
                                            disabled
                                            value={openedMessage.occupation}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Alıcı{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedMessage.to}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Gönderilme Tarihi{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedMessage.date}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 col-span-2 lg:col-span-1">
                                    <Label>
                                        Mesaj içeriği{" "}
                                        <span className="text-red-600">*</span>{" "}
                                    </Label>

                                    <textarea
                                        className="w-full min-h-[200px]  rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:placeholder:text-white/30 dark:focus:border-brand-800  text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                        disabled
                                        value={openedMessage.content}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={closeModal}
                            >
                                Kapat
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function stringToRGB(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash >> 0) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = (hash >> 16) & 0xff;

    return `rgb(${r}, ${g}, ${b})`;
}
