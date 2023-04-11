import { IDepartment } from "./department";
import { IUser } from "./user";

export type IAssignment = {
    _id: string;
    title: string;
    description: string;
    attachment: string;
    dueDate: string;
    level: string;
    departments: IDepartment[];
    submissions: string[];
    createdBy: IUser;
    createdAt: string;
    updatedAt: string;
};
