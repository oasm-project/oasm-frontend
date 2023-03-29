export enum Role {
    "student" = "student",
    "lecturer" = "lecturer",
    "admin" = "admin"
}

export interface IDepartment {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

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
