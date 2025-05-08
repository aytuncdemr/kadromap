import AddNote from "@/components/form/form-elements/AddNote";

import { Metadata } from "next";

export const metadata:Metadata = {
    title:"Not Ekle - Kadromap"
}

export default function AddNotePage() {
    return (
        <div className="grid grid-cols-2">
            <AddNote></AddNote>
        </div>
    );
}
