import { getSession } from "@/api/getSession";
import { AdminDashboardLayout } from "@/components/Layout";
import { IUser } from "@/types/user";
import { GetServerSidePropsContext } from "next";
import React from "react";

type Props = {
    user: IUser | null;
};

function AdminPage({ user }: Props) {
    return (
        <AdminDashboardLayout user={user}>
            <h1>Hello, {user?.name}</h1>

            <p>Admin Dashboard</p>
        </AdminDashboardLayout>
    );
}

export default AdminPage;

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
