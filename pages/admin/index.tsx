import { getSession } from "@/api/getSession";
import { IUser } from "@/types/user";
import { GetServerSidePropsContext } from "next";
import React from "react";

type Props = {
    user: IUser | null;
};

function Admin({ user }: Props) {
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-3xl font-bold">Admin</h1>

            <div className="flex flex-col space-y-2">
                <p>Username: {user?.name}</p>

                <p>Role: {user?.role}</p>

                <p>Email: {user?.email}</p>
            </div>
        </div>
    );
}

export default Admin;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // TODO: Check if user is logged in, if yes, redirect to dashboard
    const user = await getSession(ctx, {
        redirect: "/signin?redirect=/admin"
    });

    if (user?.role !== "admin") {
        ctx.res.writeHead(302, { Location: "/" });
    }

    return {
        props: {
            user: user || null
        }
    };
}
