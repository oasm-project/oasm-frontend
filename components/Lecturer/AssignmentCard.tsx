import { IAssignment } from "@/types/assignment";
import { IUser } from "@/types/user";
import { format } from "date-fns";
import Link from "next/link";

type AssignmentCardProps = {
    assignment: IAssignment;
    user: IUser;
};

function AssignmentCard({ assignment, user }: AssignmentCardProps) {
    return (
        <Link
            className="border rounded-md p-4 mb-4 bg-white hover:scale-105 transition-transform duration-150"
            href={user.role === "lecturer" ? `/dashboard/assignments/${assignment._id}` : `/assignments/${assignment._id}`}
            passHref
        >
            <h2 className="text-lg font-bold mb-2">{assignment.title}</h2>
            <p className="text-sm mb-4">{assignment.description}</p>
            <p className="text-sm mb-4">
                <strong>Due Date: </strong>
                {format(new Date(assignment.dueDate), "dd MMMM yyyy")}
            </p>
            {assignment.attachment && (
                <div
                    className="text-green-600 hover:underline cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        window.open(`${process.env.BACKEND_BASE_URL}/${assignment.attachment}`, "_blank");
                    }}
                >
                    Download Attachment
                </div>
            )}
        </Link>
    );
}

export default AssignmentCard;
