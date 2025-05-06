"use client";

import React, { useContext, useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import stringToRGB from "../../../lib/stringToRGB";
import { Note } from "../../../interfaces/Note";
import { AuthContext } from "@/context/AuthContext";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export default function NotesTable() {
    const { isOpen, closeModal, openModal } = useModal(false);
    const [openedNote, setOpenedNote] = useState<Note | null>(null);

    const [notes, setNotes] = useState<Note[] | null>(null);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        async function getNotes() {
            try {
                const { data } = await axios.get("/api/notes", {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`,
                    },
                });
                setNotes(data);
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
        getNotes();
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
                                    Tarih
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {notes?.map((note) => (
                                <TableRow
                                    onClick={() => {
                                        setOpenedNote(note);
                                        openModal();
                                    }}
                                    className="hover:bg-gray-100 duration-150 cursor-pointer"
                                    key={note?._id?.toString()}
                                >
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full">
                                                <FontAwesomeIcon
                                                    icon={faUserCircle}
                                                    style={{
                                                        color: stringToRGB(
                                                            note.fromName +
                                                                note.date
                                                        ),
                                                    }}
                                                    className="text-4xl xl:text-5xl"
                                                ></FontAwesomeIcon>
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {note.fromName}
                                                </span>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {note.fromEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {note.title}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            <p>{note.departmentName}</p>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {note.date}
                                    </TableCell>
                                </TableRow>
                            )).reverse()}
                            {(notes?.length === 0 || !notes) && (
                                <tr>
                                    <td className="p-4 text-center">
                                        Görüntelenecek bir not yok
                                    </td>
                                </tr>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {openedNote && (
                <Modal
                    isOpen={isOpen}
                    onClose={closeModal}
                    className="max-w-[700px] m-4"
                >
                    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                {openedNote.fromName} - Not
                            </h4>
                            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 lg:mb-7"></p>
                        </div>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-3">
                                <h5 className="mb-5 text-lg xl:text-xl font-medium text-gray-800 dark:text-white/90 lg:mb-8 flex flex-row justify-between">
                                    <p>{openedNote.title}</p>
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
                                            value={openedNote.departmentName}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Tarih{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>{" "}
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={openedNote.date}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 col-span-2 lg:col-span-1">
                                    <Label>
                                        Not içeriği{" "}
                                        <span className="text-red-600">*</span>{" "}
                                    </Label>

                                    <textarea
                                        className="w-full min-h-[250px]  rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:placeholder:text-white/30 dark:focus:border-brand-800  text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                        disabled
                                        value={openedNote.content}
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
