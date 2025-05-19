"use client";
import React from "react";
import { User } from "../../../interfaces/User";
import { cities } from "../../../data/cities";

export default function UserAddressCard({ user }: { user: User }) {

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Adres
                        </h4>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Ülke <span className="text-red-500">*</span>
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    Türkiye
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Şehir & İl{" "}
                                    <span className="text-red-500">*</span>
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {user.city}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Posta Kodu{" "}
                                    <span className="text-red-500">*</span>
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {cities.find(
                                        (city) => city.name === user.city
                                    )?.postalCode || "34000"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    UUID <span className="text-red-500">*</span>
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {user._id
                                        ?.toString()
                                        ?.match(/.{1,4}/g)
                                        ?.join("-")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
