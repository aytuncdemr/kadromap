"use client";
import React, { useContext, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { User } from "../../../interfaces/User";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { AuthContext } from "@/context/AuthContext";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export default function UserMetaCard({ user }: { user: User }) {
    const authContext = useContext(AuthContext);
    const [userEdit, setUserEdit] = useState<User>(user as User);
    const [showPassword, setShowPassword] = useState(false);

    const { isOpen, openModal, closeModal } = useModal(false);
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await axios.put("/api/users", userEdit, {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`,
                },
            });

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
            closeModal();
            setShowPassword(false);
        }
    };

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 flex items-center justify-center overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <FontAwesomeIcon
                                icon={faCircleUser}
                                className="text-4xl xl:text-5xl"
                            ></FontAwesomeIcon>
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {user.name + " " + user.lastName}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.occupation}
                                </p>
                                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user.city + " / Türkiye"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                            <a
                                href="https://www.linkedin.com/in/aytun%C3%A7-demir-70339723a/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                                        fill=""
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                fill=""
                            />
                        </svg>
                        Düzenle
                    </button>
                </div>
            </div>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[700px] m-4"
            >
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Kişisel bilgilerinizi düzenleyin
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Profilinizi güncel tutmak için kişisel bilgilerinizi
                            güncel tutun
                        </p>
                    </div>
                    <form onSubmit={handleSave} className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Bilgilerim
                                </h5>

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
                                            value={userEdit.name}
                                            onChange={(e) =>
                                                setUserEdit((prevState) => {
                                                    return {
                                                        ...prevState,
                                                        name: e.target.value,
                                                    };
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Soyisim{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={userEdit.lastName}
                                            onChange={(e) =>
                                                setUserEdit((prevState) => {
                                                    return {
                                                        ...prevState,
                                                        lastName:
                                                            e.target.value,
                                                    };
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            E-posta{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={userEdit.email}
                                            onChange={(e) =>
                                                setUserEdit((prevState) => {
                                                    return {
                                                        ...prevState,
                                                        email: e.target.value,
                                                    };
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2 relative lg:col-span-1">
                                        <Label>
                                            Şifre{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            value={userEdit.password}
                                            disabled
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                        >
                                            {" "}
                                            <span
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-5"
                                            >
                                                {showPassword ? (
                                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                                )}
                                            </span>
                                        </Input>
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Telefon{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={userEdit.phone}
                                            onChange={(e) =>
                                                setUserEdit((prevState) => {
                                                    return {
                                                        ...prevState,
                                                        phone: e.target.value.slice(
                                                            0,
                                                            11
                                                        ),
                                                    };
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Şehir (Türkiye/){" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={userEdit.city}
                                            onChange={(e) =>
                                                setUserEdit((prevState) => {
                                                    return {
                                                        ...prevState,
                                                        city: e.target.value,
                                                    };
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Departman{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={
                                                userEdit.departmentName ||
                                                "Atama yapılmamış"
                                            }
                                            disabled
                                        />
                                    </div>{" "}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>
                                            Görev{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={
                                                userEdit.occupation ||
                                                "Atama yapılmamış"
                                            }
                                            disabled
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>
                                            Üyelik Tarihi{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            disabled
                                            value={userEdit.date}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label>
                                            UUID{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            disabled
                                            type="text"
                                            value={userEdit._id
                                                ?.toString()
                                                ?.match(/.{1,4}/g)
                                                ?.join("-")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button type="submit" size="sm">
                                Kaydet
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={closeModal}
                            >
                                İptal
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
