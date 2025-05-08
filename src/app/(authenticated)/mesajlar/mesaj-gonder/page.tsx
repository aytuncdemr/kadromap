import AddMessage from "@/components/form/form-elements/AddMessage";
import { Metadata } from "next";

export const metadata:Metadata = {
    title:"Mesaj Gönder - Kadromap"
}

export default function SendMessagePage() {
    return (
        <div className="grid grid-cols-2">
            <AddMessage></AddMessage>
        </div>
    );
}
