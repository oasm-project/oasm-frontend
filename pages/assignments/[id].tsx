import { getSession } from "@/api/getSession";
import { AssignmentPreview } from "@/components";
import { LecturerDashboardLayout, MainLayout } from "@/components/Layout";
import { IAssignment } from "@/types/assignment";
import { IUser } from "@/types/user";
import { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { assignmentsGetOne } from "@/api";
import { getCookie } from "cookies-next";

type Props = {
    user: IUser | null;
    assignment: IAssignment | null;
};

function AssignmentPreviewPage({ user, assignment }: Props) {
    return (
        <MainLayout user={user}>
            <div className="p-5">{assignment && user ? <AssignmentPreview assignment={assignment} user={user} /> : <p>No assignment found.</p>}</div>
        </MainLayout>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { id } = ctx.params!;
    const user = await getSession(ctx, {
        redirect: "/signin?redirect=/dashboard"
    });

    const accessToken = getCookie("access_token", {
        req: ctx.req
    });

    if (user?.role !== "student") {
        ctx.res.writeHead(302, { Location: "/" });
        ctx.res.end();
    }
    let assignment: IAssignment | null = null;

    if (user) {
        try {
            const response = await assignmentsGetOne(id as string, accessToken as string);
            if (response.data.success) {
                assignment = response.data.data;
            }
        } catch (error: AxiosError | any) {
            console.error(error);
        }
    }

    console.log(assignment);

    return {
        props: {
            user,
            assignment
        }
    };
}

export default AssignmentPreviewPage;
