import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kadromap - Giriş Yap ",
};

export default function SignIn() {
    return <SignInForm />;
}
