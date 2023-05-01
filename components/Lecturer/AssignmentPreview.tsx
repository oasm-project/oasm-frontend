import { IAssignment } from "@/types/assignment";
import { IUser } from "@/types/user";
import { format } from "date-fns";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import Button from "../Button";

interface Props {
    assignment: IAssignment;
    user: IUser;
}

const AssignmentPreview: React.FC<Props> = ({ assignment, user }) => {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{assignment.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{assignment.description}</p>
            </div>
            <div className="px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {assignment.attachment && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Attachment</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <a href={`${process.env.BACKEND_BASE_URL}/${assignment.attachment}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                    Download Attachment
                                </a>
                            </dd>
                        </div>
                    )}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <div className="flex items-center">
                                {format(new Date(assignment.dueDate), "dd MMMM yyyy")}
                                {/* check if assignment is overdue */}
                                {new Date(assignment.dueDate) < new Date() && <BsFillCalendarCheckFill className="ml-2 text-red-500" />}
                            </div>
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Level</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{assignment.level}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Departments</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{assignment.departments.map((dept) => dept.name).join(", ")}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Submissions</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{assignment.submissions.length}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{assignment.createdBy.name}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Created At</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{format(new Date(assignment.createdAt), "dd/MM/yyyy")}</dd>
                    </div>
                    {/* Release Result */}
                    {user.role === "lecturer" && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Release Result</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Button text="Release Result" />
                            </dd>
                        </div>
                    )}
                    {/* View Result */}
                    {user.role === "student" && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">View Result</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">PENDING</dd>
                        </div>
                    )}
                </dl>
            </div>
        </div>
    );
};

export default AssignmentPreview;
