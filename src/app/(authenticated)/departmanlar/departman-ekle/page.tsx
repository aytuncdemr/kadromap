
import AddDepartment from "@/components/departments/AddDepartment";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Departman Ekle - Kadromap",
};

export default function AddDepartmentPage() {
    return (
        <div>
            <AddDepartment></AddDepartment>
        </div>
    );
}
