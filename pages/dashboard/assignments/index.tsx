import { assignmentsCreate, assignmentsGetAll, departmentsGetAll } from "@/api";
import { getSession } from "@/api/getSession";
import { AssignmentCard, Button, FileInput, Modal, SelectInput, TextInput } from "@/components";
import { LecturerDashboardLayout } from "@/components/Layout";
import Header from "@/components/Lecturer/Header";
import { ModalHandle } from "@/components/Modal";
import { IAssignment } from "@/types/assignment";
import { IUser } from "@/types/user";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
    user: IUser | null;
    assignments?: IAssignment[];
    departments?: DepartmentData[];
};

type DepartmentData = {
    label: string;
    value: string;
};

type FormValues = {
    title: string;
    description: string;
    dueDate: string;
    level: string;
    department: string;
    attachment: File | null;
};

const LEVEL_DATA = [
    {
        label: "100",
        value: "100"
    },
    {
        label: "200",
        value: "200"
    },
    {
        label: "300",
        value: "300"
    },
    {
        label: "400",
        value: "400"
    }
];

function LecturerDashboard({ assignments, departments, user }: Props) {
    const modalRef = React.useRef<ModalHandle>(null);
    const [loading, setLoading] = React.useState(false);
    const [assignmentsData, setAssignmentsData] = React.useState<IAssignment[]>(assignments || []);

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty, isValid },
        setError,
        reset
    } = useForm<FormValues>({
        mode: "onChange"
    });

    const onSubmit = async (data: FormValues) => {
        var formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("dueDate", data.dueDate);
        formData.append("level", data.level);
        formData.append("departments[0]", data.department);
        formData.append("attachment", data.attachment as File, data.attachment?.name);

        setLoading(true);
        try {
            const response = await assignmentsCreate(formData);
            if (response.data.success) {
                setAssignmentsData((assignments) => [...assignments, response.data.data]);
                modalRef.current?.close();
                reset();
            }
        } catch (error: AxiosError | any) {
            if (error.response?.status === 400) {
                setError("root", {
                    type: "manual",
                    message: error.response.data.message || "Something went wrong"
                });

                console.error(error.response.data);
            } else {
                setError("root", {
                    type: "manual",
                    message: "Something went wrong"
                });
            }

            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <LecturerDashboardLayout user={user}>
            <Header user={user}>
                <h1 className="text-2xl font-bold text-green-700">Assignments</h1>
                <Button text="Create Assignment" onClick={() => modalRef.current?.open()} className="px-6 py-3 bg-green-700 text-white rounded-md font-semibold" />
            </Header>

            <div className="p-5">
                {assignmentsData?.length && user ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignmentsData.map((assignment) => (
                            <AssignmentCard key={assignment._id} assignment={assignment} user={user} />
                        ))}
                    </div>
                ) : (
                    <p>No assignments found.</p>
                )}
            </div>

            {/* Create Assignment Modal */}
            <Modal noCancelButton ref={modalRef}>
                <div className="flex flex-col items-center justify-center max-w-[500px] p-5">
                    <h1 className="text-2xl font-bold text-center">
                        <span className="text-green-700">Create</span> Assignment
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <TextInput
                            control={control}
                            name="title"
                            type="text"
                            label="Title"
                            placeholder="Enter title"
                            rules={{
                                required: "Title is required"
                            }}
                        />

                        <TextInput
                            control={control}
                            name="description"
                            type="text"
                            label="Description"
                            placeholder="Enter description"
                            rules={{
                                required: "Description is required"
                            }}
                        />

                        <TextInput
                            control={control}
                            name="dueDate"
                            type="date"
                            label="Due Date"
                            placeholder="Enter due date"
                            rules={{
                                required: "Due date is required"
                            }}
                        />

                        <SelectInput
                            control={control}
                            data={LEVEL_DATA}
                            name="level"
                            label="Level"
                            defaultValue=""
                            rules={{
                                required: "Level is required"
                            }}
                        />

                        <SelectInput
                            control={control}
                            defaultValue=""
                            data={departments || []}
                            name="department"
                            label="Department"
                            rules={{
                                required: "Department is required"
                            }}
                        />

                        <FileInput
                            control={control}
                            name="attachment"
                            label="Attachment"
                            rules={{
                                required: {
                                    value: true,
                                    message: "Attachment is required"
                                },
                                validate: {
                                    lessThan10MB: (file) => file?.size < 10000000 || "Max 10MB"
                                }
                            }}
                        />

                        <Button
                            loading={loading}
                            type="submit"
                            text="Create Assignment"
                            className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold sm:col-span-2"
                            disabled={!isDirty || !isValid}
                        />
                        {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}
                    </form>
                </div>
            </Modal>
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
        const departments: DepartmentData[] = await (await departmentsGetAll()).data.data.map((department: { name: string; _id: string }) => ({ label: department.name, value: department._id }));

        return {
            props: {
                assignments,
                departments,
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
