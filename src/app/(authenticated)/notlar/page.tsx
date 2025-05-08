export const metadata: Metadata = {
    title: "Notlar - Kadromap",
};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NotesTable from "@/components/tables/NotesTable";
import { Metadata } from "next";

export default function NotesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Notlar" />
            <div className="space-y-6">
                <NotesTable></NotesTable>
            </div>
        </div>
    );
}
