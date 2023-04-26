import { assignmentsGetAll } from "@/api";
import { getSession } from "@/api/getSession";
import { Button } from "@/components";
import { LecturerDashboardLayout } from "@/components/Layout";
import Header from "@/components/Lecturer/Header";
import { IAssignment } from "@/types/assignment";
import { IUser } from "@/types/user";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";

type Props = {
    user: IUser | null;
    assignments?: IAssignment[];
};

function LecturerDashboard({ user, assignments }: Props) {
    return (
        <LecturerDashboardLayout user={user}>
            <Header user={user}>
                <h1 className="text-2xl font-bold text-green-700">Assignments</h1>
                <Button text="Create Assignment" />
            </Header>
            <div className="flex flex-col space-y-5 p-5">
                <div className="flex flex-col md:flex-row md:space-x-5 md:space-y-0 space-y-5">
                    <div className="flex-1 bg-white p-5 rounded-md shadow-md">
                        <h1 className="text-2xl font-bold text-green-700">Assignments Created</h1>
                        <Link href="/dashboard/assignments" className="text-gray-500 hover:underline">
                            View all assignments
                        </Link>
                        <div className="mt-5">
                            <p className="text-gray-500">Total Assignments</p>
                            <h1 className="text-3xl font-bold">{assignments?.length}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </LecturerDashboardLayout>
    );
}

export default LecturerDashboard;

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: Props }> {
    // TODO: Check if user is logged in, if yes, redirect to dashboard
    const user = await getSession(ctx, {
        redirect: "/signin?redirect=/dashboard"
    });

    const accessToken = getCookie("access_token", {
        req: ctx.req
    });

    if (user?.role !== "lecturer") {
        ctx.res.writeHead(302, { Location: "/" });
        ctx.res.end();
    }

    try {
        const assignments = await (await assignmentsGetAll(`createdBy=${user?._id}`, accessToken as string)).data.data.assignments;

        return {
            props: {
                assignments,
                user: user || null
            }
        };
    } catch (error: any) {
        console.log(error);

        return {
            props: {
                user: user || null
            }
        };
    }
}
