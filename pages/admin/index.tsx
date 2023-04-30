import { assignmentsGetAll, departmentsGetAll, resultsGetAll, submissionsGetAll, usersGetAll } from "@/api";
import { getSession } from "@/api/getSession";
import { AdminDashboardLayout } from "@/components/Layout";
import { IAssignment } from "@/types/assignment";
import { IDepartment } from "@/types/department";
import { IResult } from "@/types/result";
import { ISubmission } from "@/types/submission";
import { IUser } from "@/types/user";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import React from "react";

type Props = {
    user: IUser | null;
    users?: IUser[];
    departments?: IDepartment[];
    assignments?: IAssignment[];
    submissions?: ISubmission[];
    results?: IResult[];
};

function AdminPage({ user, users, departments, assignments, submissions, results }: Props) {
    const totalStudents = users?.filter((user) => user.role === "student");
    const totalLecturers = users?.filter((user) => user.role === "lecturer");
    const totalAdmins = users?.filter((user) => user.role === "admin");

    return (
        <AdminDashboardLayout user={user}>
            <div className="flex flex-col items-center w-full h-full space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                    <h3 className="text-lg font-medium mb-2">Total Users Created</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-600 text-white p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2">Students</h4>
                            <span className="text-4xl font-bold">{totalStudents?.length}</span>
                        </div>
                        <div className="bg-green-600 text-white p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2">Lecturers</h4>
                            <span className="text-4xl font-bold">{totalLecturers?.length}</span>
                        </div>
                        <div className="bg-green-600 text-white p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2">Admins</h4>
                            <span className="text-4xl font-bold">{totalAdmins?.length}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                    <h3 className="text-lg font-medium mb-2">Total Assignments, Submissions, Results, and Departments</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-green-600 text-white p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2">Assignments</h4>
                            <span className="text-4xl font-bold">{assignments?.length}</span>
                        </div>
                        <div className="bg-green-600 text-white p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2">Submissions</h4>
                            <span className="text-4xl font-bold">{submissions?.length}</span>
                        </div>
                        <div className="bg-green-600 text-white p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2">Results</h4>
                            <span className="text-4xl font-bold">{results?.length}</span>
                        </div>
                        <div className="bg-green-600 text-white p-4 rounded-lg">
                            <h4 className="text-lg font-medium mb-2">Departments</h4>
                            <span className="text-4xl font-bold">{departments?.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
}

export default AdminPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: Props }> {
    // TODO: Check if user is logged in, if yes, redirect to dashboard
    const user = await getSession(ctx, {
        redirect: "/signin?redirect=/admin"
    });

    const accessToken = getCookie("access_token", {
        req: ctx.req
    });

    console.log("accessToken", accessToken);

    if (user?.role !== "admin") {
        ctx.res.writeHead(302, { Location: "/" }).end();
    }

    try {
        const users = await (await usersGetAll(accessToken as string)).data.data.users;
        const departments = await (await departmentsGetAll(accessToken as string)).data.data;
        const assignments = await (await assignmentsGetAll("", accessToken as string)).data.data.assignments;
        const submissions = await (await submissionsGetAll(accessToken as string)).data.data.submissions;
        const results = await (await resultsGetAll("", accessToken as string)).data.data.results;

        return {
            props: {
                users,
                departments,
                assignments,
                submissions,
                results,
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
