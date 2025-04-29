import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kadromap - Kayıt Ol",
};

export default function SignUp() {
  return <SignUpForm />;
}
