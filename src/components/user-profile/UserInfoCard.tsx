"use client";
import React from "react";
import { User } from "../../../interfaces/User";

export default function UserInfoCard({ user }: { user: User }) {
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
                                {user.departmentName || "Atama yapılmamış"}/
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Görev
                                <span className="text-red-600">*</span>
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {user.occupation || "Atama yapılmamış"}
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
        </div>
    );
}
