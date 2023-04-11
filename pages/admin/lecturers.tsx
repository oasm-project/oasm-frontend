import { usersGetAll, usersUpdate } from "@/api";
import { getSession } from "@/api/getSession";
import { AdminDashboardLayout } from "@/components/Layout";
import { IUser } from "@/types/user";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
type Props = {
    user: IUser | null;
    lecturers?: IUser[];
};
function LecturersPage({ user, lecturers }: Props) {
    const [searchString, setSearchString] = React.useState<string>("");
    const [lecturersData, setLecturersData] = React.useState<IUser[] | undefined>(lecturers);

    const filteredLecturers = React.useMemo(() => {
        if (!searchString) return lecturersData || [];

        return (
            lecturersData?.filter((lecturer) => {
                const name = lecturer.name.toLowerCase();
                const searchStringLower = searchString.toLowerCase();

                return name.includes(searchStringLower);
            }) || []
        );
    }, [lecturersData, searchString]);

    const toggleVerified = async (lecturer: IUser) => {
        try {
            const response = await usersUpdate(lecturer._id, { isVerified: !lecturer.isVerified });

            if (response.data.success) {
                const updatedLecturer = response.data.data;
                const updatedLecturers = lecturers?.map((lecturer) => {
                    if (lecturer._id === updatedLecturer._id) return updatedLecturer;
                    return lecturer;
                });
                setLecturersData(updatedLecturers);
            }
        } catch (error: AxiosError | any) {
            console.log(error);
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
                </div>

                {/* Lecturers List */}
                <table className="w-full mt-8">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Lecturer Name</th>
                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLecturers
                            .sort((a, b) => (a.name > b.name ? 1 : -1))
                            .map((lecturer, i) => (
                                <tr key={lecturer._id} className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-left text-sm font-medium text-gray-900">{i + 1}</td>
                                    <td className="py-3 px-4 text-left text-sm font-medium text-gray-900">{`${lecturer.name.slice(0, 1).toUpperCase()}${lecturer.name.slice(1).toLowerCase()}
                                    `}</td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-500">{lecturer.email}</td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-500">{format(new Date(lecturer.createdAt), "dd/MM/yyyy")}</td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-500">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={lecturer.isVerified} className="sr-only peer" onChange={() => toggleVerified(lecturer)} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </AdminDashboardLayout>
    );
}

export default LecturersPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: Props }> {
    // TODO: Check if user is logged in, if yes, redirect to dashboard
    const user = await getSession(ctx, {
        redirect: "/signin?redirect=/admin"
    });

    const accessToken = getCookie("access_token", {
        req: ctx.req
    });

    if (user?.role !== "admin") {
        ctx.res.writeHead(302, { Location: "/" }).end();
    }

    try {
        const lecturers = await (await usersGetAll(accessToken as string)).data.data.users.filter((user: IUser) => user.role === "lecturer");

        return {
            props: {
                lecturers,
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
