import { IUser } from "@/types/user";
import React from "react";
import SidebarIcon from "./SidebarIcon";
import { MdSpaceDashboard } from "react-icons/md";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/router";

type Props = {
    user: IUser | null;
};

const Sidebar = ({ user }: Props) => {
    const router = useRouter();
    return (
        <div className="col-span-2 h-full p-5 flex flex-col shadow-md">
            <h1 className="text-2xl font-bold text-green-700">Admin Dashboard</h1>

            <div className="mt-10 flex flex-col space-y-5">
                <SidebarIcon url="/admin" title="Dashboard" Icon={MdSpaceDashboard} />
                <SidebarIcon url="/admin/departments" title="Departments" Icon={MdAssignmentTurnedIn} />
            </div>

            <div className="flex-1 flex flex-col justify-end">
                <SidebarIcon url="/logout" title="Logout" Icon={MdLogout} />
            </div>
        </div>
    );
};

export default Sidebar;
