import { IAssignment } from "@/types/assignment";
import { format } from "date-fns";
import Link from "next/link";

type AssignmentCardProps = {
    assignment: IAssignment;
};

function AssignmentCard({ assignment }: AssignmentCardProps) {
    return (
        <Link className="border rounded-md p-4 mb-4" href={`/dashboard/assignments/${assignment._id}`} passHref>
            <h2 className="text-lg font-bold mb-2">{assignment.title}</h2>
            <p className="text-sm mb-4">{assignment.description}</p>
            <p className="text-sm mb-4">
                <strong>Due Date: </strong>
                {format(new Date(assignment.dueDate), "dd MMMM yyyy")}
            </p>
            {assignment.attachment && (
                <a href={`${process.env.BACKEND_BASE_URL}/${assignment.attachment}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                    Download Attachment
                </a>
            )}
        </Link>
    );
}

export default AssignmentCard;
