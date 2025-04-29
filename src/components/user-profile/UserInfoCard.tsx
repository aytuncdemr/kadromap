"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { User } from "../../../interfaces/User";
import { EyeCloseIcon, EyeIcon } from "@/icons";

export default function UserInfoCard({
    user,
    setUser,
}: {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
    const {
        isOpen,
        openModal,
        closeModal,
        userEdit,
        showPassword,
        setUserEdit,
        setShowPassword,
        handleSave,
    } = useModal(false, user, setUser);

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        Kişisel Bilgiler
                    </h4>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                İsim <span className="text-red-600">*</span>
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.name}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Soyisim <span className="text-red-600">*</span>
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.lastName}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                E-posta <span className="text-red-600">*</span>
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Telefon <span className="text-red-600">*</span>
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.phone}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Departman
                                <span className="text-red-600">*</span>
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.departmentName}/
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Görev
                                <span className="text-red-600">*</span>
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.occupation}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Üyelik Tarihi
                                <span className="text-red-600">*</span>
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.date}
                            </p>
                        </div>
                    </div>
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
        </div>
    );
}
