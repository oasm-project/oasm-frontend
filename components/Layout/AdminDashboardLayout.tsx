import { IUser } from "@/types/user";
import React from "react";
import Sidebar from "../Admin/Sidebar";

type Props = {
    children: React.ReactNode;
    user: IUser | null;
};

const AdminDashboardLayout = ({ user, children }: Props) => {
    return (
        <React.Fragment>
            <div className="hidden md:grid grid-cols-10 h-screen">
                <Sidebar user={user} />
                <div className="col-span-8 p-5">{children}</div>
            </div>

            <div className="flex justify-center items-center h-screen md:hidden">
                <p>Open this page on a desktop to view the admin dashboard.</p>
            </div>
        </React.Fragment>
    );
};

export default AdminDashboardLayout;
