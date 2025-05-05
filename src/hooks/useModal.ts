"use client";
import { useState, useCallback, useContext } from "react";
import { User } from "../../interfaces/User";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";

export const useModal = (initialState: boolean = false, user?: User) => {
    const [isOpen, setIsOpen] = useState(initialState);

    const [userEdit, setUserEdit] = useState<User>(user as User);
    const [showPassword, setShowPassword] = useState(false);

    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => {
        setUserEdit(user as User);
        setShowPassword(false);
        setIsOpen(false);
    }, []);
    const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);
    const authContext = useContext(AuthContext);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await axios.put("/api/users", userEdit, {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`,
                },
            });

            toast.success(data.message);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                console.log(error);
                toast.error("Bir şeyler ters gitti");
            }
        } finally {
            closeModal();
        }
    };

    return {
        isOpen,
        openModal,
        closeModal,
        toggleModal,
        userEdit,
        setUserEdit,
        showPassword,
        setShowPassword,
        handleSave,
    };
};
