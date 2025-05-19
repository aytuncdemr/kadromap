import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/context/AuthContext";

const outfit = Outfit({
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.className} dark:bg-gray-900`}>
                <AuthProvider>
                    <ThemeProvider>
                        <SidebarProvider>{children}</SidebarProvider>
                    </ThemeProvider>
                    <ToastContainer
                        newestOnTop
                        style={{ zIndex: 100000 }}
                    ></ToastContainer>
                </AuthProvider>
            </body>
        </html>
    );
}
