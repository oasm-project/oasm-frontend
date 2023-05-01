import { IUser, Role } from "@/types/user";
import Link from "next/link";
import React from "react";
import Button from "./Button";

type Props = {
    user?: IUser | null;
    middleContent?: React.ReactNode;
};

function Navbar({ user, middleContent }: Props) {
    return (
        <nav className="flex justify-between items-center py-4 px-5 md:px-10 shadow-sm bg-white sticky top-0 w-full mx-auto z-10">
            <Link href="/">
                <h1 className="text-3xl font-bold">OASM</h1>
            </Link>

            {middleContent && <div className="flex-1 flex justify-center items-center">{middleContent}</div>}

            <div className="space-x-5">
                {!user && (
                    <>
                        <Link href="/signin">
                            <Button text="Sign in" />
                        </Link>

                        <Link href="/signup">
                            <Button outline text="Sign up" />
                        </Link>
                    </>
                )}

                {user && (
                    <>
                        {!middleContent && (
                            <Link href={user.role === Role.admin ? "/admin" : user.role === Role.lecturer ? "/dashboard" : "/assignments"}>
                                {[Role.admin, Role.lecturer].includes(user.role) ? <Button text="Dashboard" /> : <Button text="Assignments" />}
                            </Link>
                        )}

                        <Link href="/logout">
                            <Button outline text="Logout" />
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
