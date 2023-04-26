import { IUser } from "@/types/user";
import React from "react";

type Props = {
    user: IUser | null;
};

const Header = ({ user }: Props) => {
    return (
        <div className="flex items-center justify-between space-x-5 bg-white shadow-md p-5">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold text-green-700">Hello, {user?.name}</h1>
                <p className="text-gray-500">Welcome to your dashboard</p>
            </div>

            <div className="flex items-center space-x-5">
                <div className="flex flex-col space-y-2">
                    <p className="text-gray-500 font-semibold">Account Status</p>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <p className="text-green-500">{user?.isVerified ? "Verified" : "Not Verified"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
