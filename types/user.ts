import { IDepartment } from "./department";

export enum Role {
    "student" = "student",
    "lecturer" = "lecturer",
    "admin" = "admin"
}

export const UserRole = {
    student: [Role.student, Role.lecturer, Role.admin],
    lecturer: [Role.lecturer, Role.admin],
    admin: [Role.admin]
};

export interface IUser {
    name: string;
    email: string;
    password: string;
    image: string;
    role: Role;
    matric: number;
    level: string;
    department: string;
    submissions: IDepartment[];
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
