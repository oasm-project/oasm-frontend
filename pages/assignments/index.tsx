import { assignmentsGetAll } from "@/api";
import { getSession } from "@/api/getSession";
import { AssignmentCard } from "@/components";
import { MainLayout } from "@/components/Layout";
import { IAssignment } from "@/types/assignment";
import { IUser, Role, UserRole } from "@/types/user";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import React from "react";

type Props = {
    user: IUser | null;
    assignments?: IAssignment[];
};

function AssignmentsPage({ user, assignments }: Props) {
    return (
        <MainLayout user={user}>
            <div className="p-5">
                {assignments?.length && user ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignments.map((assignment) => (
                            <AssignmentCard key={assignment._id} assignment={assignment} user={user} />
                        ))}
                    </div>
                ) : (
                    <p>No assignments found.</p>
                )}
            </div>
        </MainLayout>
    );
}

export default AssignmentsPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // TODO: Check if user is logged in, if yes, redirect to dashboard
    const user = await getSession(ctx, {
        redirect: "/signin?redirect=/assignments"
    });

    const accessToken = getCookie("access_token", {
        req: ctx.req
    });

    if (user && !UserRole.student.includes(user.role)) {
        ctx.res.writeHead(302, { Location: "/" }).end();
    }

    let assignments = [];

    if (user) {
        const response = await assignmentsGetAll("", accessToken as string);
        assignments = response.data.data.assignments || ([] as IAssignment[]);
    }

    return {
        props: {
            user: user || null,
            assignments
        }
    };
}
