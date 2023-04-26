import { assignmentsGetAll } from "@/api";
import { getSession } from "@/api/getSession";
import { Button } from "@/components";
import { LecturerDashboardLayout } from "@/components/Layout";
import Header from "@/components/Lecturer/Header";
import { IAssignment } from "@/types/assignment";
import { IUser } from "@/types/user";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";

type Props = {
    user: IUser | null;
    assignments?: IAssignment[];
};

type AssignmentCardProps = {
    assignment: IAssignment;
};

function AssignmentCard({ assignment }: AssignmentCardProps) {
    return (
        <div className="border rounded-md p-4 mb-4">
            <h2 className="text-lg font-bold mb-2">{assignment.title}</h2>
            <p className="text-sm mb-4">{assignment.description}</p>
            <p className="text-sm mb-4">
                <strong>Due Date: </strong>
                {format(new Date(assignment.dueDate), "dd MMMM yyyy")}
            </p>
            <a href={`${process.env.BACKEND_BASE_URL}/${assignment.attachment}`} download={"attachment"} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Download Attachment
            </a>
        </div>
    );
}

function LecturerDashboard({ assignments, user }: Props) {
    return (
        <LecturerDashboardLayout user={user}>
            <Header user={user}>
                <h1 className="text-2xl font-bold text-green-700">Assignments</h1>
                <Button text="Create Assignment" />
            </Header>

            <div className="p-5">
                {assignments?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignments.map((assignment) => (
                            <AssignmentCard key={assignment._id} assignment={assignment} />
                        ))}
                    </div>
                ) : (
                    <p>No assignments found.</p>
                )}
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
