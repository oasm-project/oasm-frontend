import { IAssignment } from "./assignment";
import { IUser } from "./user";

export type IResult = {
    _id: string;
    attachment: string;
    assignment: IAssignment;
    user: IUser;
    createdAt: string;
    updatedAt: string;
    __v: number;
};
