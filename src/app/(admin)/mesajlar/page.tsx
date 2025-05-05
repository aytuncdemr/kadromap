import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import Messages from "@/components/messages/Messages";

export const metadata: Metadata = {
    title: "Mesajlar - Kadromap",
};

export default function MessagesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Mesajlarım" />
            <div className="space-y-6">
                <Messages></Messages>
            </div>
        </div>
    );
}
