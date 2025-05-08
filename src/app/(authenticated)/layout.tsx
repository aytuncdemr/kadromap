"use client";

import { AuthContext } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
        ? "lg:ml-[290px]"
        : "lg:ml-[90px]";

    const authContext = useContext(AuthContext);
    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        if (
            !authContext?.token &&
            path !== "/giris-yap" &&
            path !== "/kayit-ol"
        ) {
            router.push("/giris-yap");
        }
    }, [authContext?.token]);

    if (!authContext?.token) {
        return null;
    }

    return (
        <div className="min-h-screen xl:flex">
            {/* Sidebar and Backdrop */}
            <AppSidebar />
            <Backdrop />
            {/* Main Content Area */}
            <div
                className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
            >
                {/* Header */}
                <AppHeader />
                {/* Page Content */}
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
