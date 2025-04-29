"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { LoginData } from "../../../interfaces/LoginData";
import axios from "axios";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: "",
    });
    const authContext = useContext(AuthContext);
    const router = useRouter();

    async function loginHandler(e: FormEvent) {
        e.preventDefault();
        try {
            console.log("ww");
            const { data: token } = await axios.post("/api/login", loginData);

            if (rememberMe) {
                localStorage.setItem("email", loginData.email);
                localStorage.setItem("password", loginData.password);
            } else {
                localStorage.removeItem("email");
                localStorage.removeItem("password");
            }
            authContext?.setToken(token);
            router.push("/");
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
        setLoginData({
            email: localStorage.getItem("email") || "",
            password: localStorage.getItem("password") || "",
        });
    }, []);

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-2">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Giriş Yap - Kadromap
                        </h1>
                    </div>
                    <div>
                        <div className="relative py-3 sm:py-2 sm:mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm"></div>
                        </div>
                        <form onSubmit={loginHandler}>
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="email">
                                        E-posta{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>{" "}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) =>
                                            setLoginData((prevLoginData) => {
                                                return {
                                                    ...prevLoginData,
                                                    email: e.target.value,
                                                };
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">
                                        Şifre{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            value={loginData.password}
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            onChange={(e) =>
                                                setLoginData(
                                                    (prevLoginData) => {
                                                        return {
                                                            ...prevLoginData,
                                                            password:
                                                                e.target.value,
                                                        };
                                                    }
                                                )
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
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={setRememberMe}
                                        />
                                        <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                            Beni Hatırla
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Button type="submit" className="w-full" size="sm">
                                        Giriş Yap
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Hesabınız yok mu? {""}
                                <Link
                                    href="/kayit-ol"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Kayıt olun
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
