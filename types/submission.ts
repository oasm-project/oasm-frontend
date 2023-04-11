import { IAssignment } from "./assignment";
import { IUser } from "./user";

export type ISubmission = {
    _id: string;
    answer: string;
    attachment: string;
    assignment: IAssignment;
    user: IUser;
    createdAt: string;
    updatedAt: string;
    __v: number;
};
