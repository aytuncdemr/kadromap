import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Takvim - Kadromap",
};
export default function EventsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Takvim" />
            <Calendar />
        </div>
    );
}
