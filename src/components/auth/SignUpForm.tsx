"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { User } from "../../../interfaces/User";
import getTodayDate from "../../../lib/getTodayDate";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [user, setUser] = useState<User>({
        name: "",
        lastName: "",
        phone: "",
        occupation: "Atama yapılmamış",
        departmentName: "Atama yapılmamış",
        email: "",
        password: "",
        city: "",
        date: getTodayDate(),
    });

    const router = useRouter();

    async function signUpHandler(e: FormEvent) {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/users", user);
            if (rememberMe) {
                localStorage.setItem("email", user.email);
                localStorage.setItem("password", user.password || "");
            } else {
                localStorage.removeItem("email");
                localStorage.removeItem("password");
            }

            toast.success(data.message);

            setTimeout(() => {
                router.push("/");
            }, 1000);
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

    useEffect(() => {
        setUser((prevState) => {
            return { ...prevState, date: getTodayDate() };
        });
    }, []);

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-3">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Kayıt Ol - Kadromap
                        </h1>
                    </div>
                    <div>
                        <div className="relative py-3 sm:py-2 sm:mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                            </div>
                        </div>
                        <form onSubmit={signUpHandler}>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {/* <!-- First Name --> */}
                                    <div className="sm:col-span-1">
                                        <Label htmlFor="name">
                                            İsim
                                            <span className="text-error-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            value={user.name}
                                            type="text"
                                            id="name"
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    {/* <!-- Last Name --> */}
                                    <div className="sm:col-span-1">
                                        <Label htmlFor="lastname">
                                            Soyisim
                                            <span className="text-error-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            value={user.lastName}
                                            type="text"
                                            id="lastname"
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    lastName: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {/* <!-- First Name --> */}
                                    <div className="sm:col-span-1">
                                        <Label htmlFor="phone">
                                            Telefon
                                            <span className="text-error-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            value={user.phone}
                                            type="text"
                                            id="phone"
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    phone: e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 11),
                                                })
                                            }
                                        />
                                    </div>
                                    {/* <!-- Last Name --> */}
                                    <div className="sm:col-span-1">
                                        <Label htmlFor="city">
                                            Şehir
                                            <span className="text-error-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            value={user.city}
                                            type="text"
                                            id="city"
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    city: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                {/* <!-- Email --> */}
                                <div>
                                    <Label htmlFor="email">
                                        E-posta
                                        <span className="text-error-500">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        value={user.email}
                                        type="email"
                                        id="email"
                                        onChange={(e) =>
                                            setUser({
                                                ...user,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {/* <!-- Password --> */}
                                <div>
                                    <Label htmlFor="password">
                                        Şifre
                                        <span className="text-error-500">
                                            *
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            value={user.password || ""}
                                            id="name"
                                            onChange={(e) =>
                                                setUser({
                                                    ...user,
                                                    password: e.target.value,
                                                })
                                            }
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                        />
                                        <span
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                {/* <!-- Checkbox --> */}
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        className="w-5 h-5"
                                        checked={rememberMe}
                                        onChange={setRememberMe}
                                    />
                                    <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                                        Beni hatırla
                                    </p>
                                </div>
                                {/* <!-- Button --> */}
                                <div>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                    >
                                        Kayıt ol
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Zaten bir hesabınız var mı?{" "}
                                <Link
                                    href="/giris-yap"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Giriş Yapın
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
