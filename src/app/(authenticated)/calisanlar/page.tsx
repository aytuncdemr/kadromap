import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Workers from "@/components/workers/Workers";

export const metadata = {
    title: "Çalışanlar - Kadromap",
};

export default function WorkersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Çalışanlar"></PageBreadcrumb>

            <Workers></Workers>
        </div>
    );
}
