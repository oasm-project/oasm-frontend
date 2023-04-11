import { departmentsCreate, departmentsDelete, departmentsGetAll, departmentsUpdate } from "@/api";
import { getSession } from "@/api/getSession";
import { AdminDashboardLayout } from "@/components/Layout";
import { IDepartment } from "@/types/department";
import { IUser } from "@/types/user";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Button, Modal, TextInput } from "@/components";
import { ModalHandle } from "@/components/Modal";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

type Props = {
    user: IUser | null;
    departments?: IDepartment[];
};

type FormInputs = {
    departmentName: string;
};

enum ActionType {
    CREATE = "create",
    EDIT = "edit",
    DELETE = "delete"
}

function Departments({ user, departments }: Props) {
    const [searchString, setSearchString] = React.useState<string>("");
    const [loading, setLoading] = React.useState(false);
    const [departmentsData, setDepartmentsData] = React.useState<IDepartment[]>(departments || []);

    const [actionType, setActionType] = React.useState<ActionType>(ActionType.CREATE);
    const [selectedDepartment, setSelectedDepartment] = React.useState<IDepartment | null>(null);

    const filteredDepartments = React.useMemo(() => {
        if (!searchString) return departmentsData;

        return departmentsData.filter((department) => {
            const name = department.name.toLowerCase();
            const searchStringLower = searchString.toLowerCase();

            return name.includes(searchStringLower);
        });
    }, [departmentsData, searchString]);

    const modalRef = React.useRef<ModalHandle>(null);
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormInputs>();
    const departmentName = watch("departmentName");

    React.useEffect(() => {
        if (actionType === ActionType.EDIT) {
            setValue("departmentName", selectedDepartment?.name || "");
        }
    }, [actionType, selectedDepartment, setValue]);

    const onSubmit = async (data: FormInputs) => {
        setLoading(true);
        try {
            const response = await departmentsCreate({ name: data.departmentName });

            if (response.data.success) {
                setValue("departmentName", "");
                setDepartmentsData((prev) => [...prev, response.data.data]);
                modalRef.current?.close();
            }
        } catch (error: AxiosError | any) {
            setError("root", {
                type: "manual",
                message: error.response.data.message || error.message || "Something went wrong"
            });
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // TODO: Fix Default Value
    const handleEdit = async (id: string, name: string) => {
        setLoading(true);
        try {
            const response = await departmentsUpdate(id, { name });

            if (response.data.success) {
                setDepartmentsData((prev) => prev.map((department) => (department._id === id ? { ...department, name } : department)));
                modalRef.current?.close();
            }
        } catch (error: AxiosError | any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const response = await departmentsDelete(id);

            if (response.data.success) {
                setDepartmentsData((prev) => prev.filter((department) => department._id !== id));
                modalRef.current?.close();
            }
        } catch (error: AxiosError | any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminDashboardLayout user={user}>
            <div className="flex flex-col items-center w-full h-full space-y-8">
                <div className="flex space-x-5 w-full">
                    <form className="flex items-center flex-1">
                        <label htmlFor="simple-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <HiOutlineSearch className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-700 focus:border-green-700 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-700 dark:focus:border-green-700"
                                placeholder="Search"
                                value={searchString}
                                onChange={(e) => setSearchString(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="p-2.5 ml-2 text-sm font-medium text-white bg-green-700 rounded-lg border border-green-700 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-700 dark:bg-green-700 dark:hover:bg-green-700 dark:focus:ring-green-700"
                        >
                            <HiOutlineSearch className="w-5 h-5" />
                            <span className="sr-only">Search</span>
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={() => {
                            setActionType(ActionType.CREATE);
                            modalRef.current?.open();
                        }}
                        className="flex items-center justify-center w-10 h-10 text-white bg-green-700 rounded-lg border border-green-700 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-700 dark:bg-green-700 dark:hover:bg-green-700 dark:focus:ring-green-700"
                    >
                        <HiPlus className="w-5 h-5" />
                        <span className="sr-only">Add Department</span>
                    </button>
                </div>

                {/* Departments List */}
                <table className="w-full mt-8">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDepartments.map((department, i) => (
                            <tr key={department._id} className="border-b border-gray-200">
                                <td className="py-3 px-4 text-left text-sm font-medium text-gray-900">{i + 1}</td>
                                <td className="py-3 px-4 text-left text-sm font-medium text-gray-900">{department.name}</td>
                                <td className="py-3 px-4 text-center text-sm text-gray-500">{format(new Date(department.createdAt), "dd/MM/yyyy")}</td>
                                <td className="py-3 px-4 text-center text-sm text-gray-500">
                                    <button
                                        onClick={() => {
                                            setSelectedDepartment(department);
                                            setActionType(ActionType.EDIT);
                                            modalRef.current?.open();
                                        }}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        <AiOutlineEdit className="w-5 h-5" />
                                    </button>
                                </td>
                                <td className="py-3 px-4 text text-sm text-gray-500 text-center">
                                    <button
                                        onClick={() => {
                                            setSelectedDepartment(department);
                                            setActionType(ActionType.DELETE);
                                            modalRef.current?.open();
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <AiOutlineDelete className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal noCancelButton ref={modalRef}>
                <div className="flex flex-col items-center justify-center max-w-[400px] p-5">
                    <h1 className="text-2xl font-bold text-center">
                        {actionType === ActionType.CREATE ? "Create Department" : actionType === ActionType.EDIT ? "Edit Department" : "Delete Department"}
                    </h1>

                    {/* {actionType === ActionType.CREATE || actionType === ActionType.EDIT && ( */}
                    {(actionType === ActionType.CREATE || actionType === ActionType.EDIT) && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (actionType === ActionType.CREATE) {
                                    handleSubmit(onSubmit)();
                                } else {
                                    handleEdit(selectedDepartment?._id || "", departmentName);
                                }
                            }}
                            className="flex flex-col w-full mt-5 space-y-5"
                        >
                            <TextInput
                                control={control}
                                name="departmentName"
                                type="text"
                                label="Department Name"
                                placeholder="Enter Department Name"
                                defaultValue={selectedDepartment?.name}
                                rules={{
                                    required: "Department Name is required"
                                }}
                            />

                            <Button
                                loading={loading}
                                type="submit"
                                text={actionType === ActionType.CREATE ? "Create Department" : "Update Department"}
                                className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold sm:col-span-2"
                            />
                            {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}
                        </form>
                    )}

                    {actionType === ActionType.DELETE && (
                        <div className="flex flex-col items-center justify-center w-full mt-5 space-y-5">
                            <p className="text-center">Are you sure you want to delete this department?</p>
                            <div className="flex items-center justify-center w-full space-x-5">
                                <Button
                                    title="This feature is not yet available"
                                    loading={loading}
                                    onClick={() => handleDelete(selectedDepartment?._id || "")}
                                    text="Delete"
                                    className="w-full px-6 py-3 bg-red-700 text-white rounded-md font-semibold sm:col-span-2"
                                    disabled
                                />
                                <Button onClick={() => modalRef.current?.close()} text="Cancel" className="w-full px-6 py-3 bg-gray-700 text-white rounded-md font-semibold sm:col-span-2" />
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AdminDashboardLayout>
    );
}

export default Departments;

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: Props }> {
    // TODO: Check if user is logged in, if yes, redirect to dashboard
    const user = await getSession(ctx, {
        redirect: "/signin?redirect=/admin"
    });

    const accessToken = getCookie("access_token", {
        req: ctx.req
    });

    if (user?.role !== "admin") {
        ctx.res.writeHead(302, { Location: "/" });
    }

    try {
        const departments = await (await departmentsGetAll(accessToken as string)).data.data;

        return {
            props: {
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
