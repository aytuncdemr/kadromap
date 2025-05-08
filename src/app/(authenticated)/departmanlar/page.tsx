import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Departments from "@/components/departments/Departments";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Departmanlar - Kadromap",
};

export default function DepartmentsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Departmanlar" />
            <div className="space-y-6">
                <Departments></Departments>
            </div>
        </div>
    );
}
