import { IUser } from "@/types/user";
import React from "react";
import Header from "../Lecturer/Header";
import Sidebar from "../Lecturer/Sidebar";

type Props = {
    children: React.ReactNode;
    user: IUser | null;
};

const AdminDashboardLayout = ({ user, children }: Props) => {
    return (
        <div className="flex flex-row h-screen max-w-6xl overflow-hidden">
            <Sidebar user={user} />
            <div className="flex-1">
                <Header user={user} />
                {children}
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
