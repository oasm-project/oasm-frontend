import { getSession } from "@/api/getSession";
import { IUser, Role, UserRole } from "@/types/user";
import { GetServerSidePropsContext } from "next";
import React from "react";

type Props = {
    user: IUser | null;
};

function AssignmentsPage({ user }: Props) {
    return (
        <div className="flex justify-center items-center h-screen">
            <h1>Assignments</h1>
        </div>
    );
}

export default AssignmentsPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // TODO: Check if user is logged in, if yes, redirect to dashboard
    const user = await getSession(ctx, {
        redirect: "/signin?redirect=/assignments"
    });

    console.log(user);

    if (user && !UserRole.student.includes(user.role)) {
        ctx.res.writeHead(302, { Location: "/" });
    }

    return {
        props: {
            user: user || null
        }
    };
}
