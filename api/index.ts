import { AxiosRequestConfig } from "axios";
import $http, { baseURL, frontendURL } from "./xhr";

// Authentication
export const authLogin = async (data: any, accessToken?: string) => await $http.post("/auth/login", data, getConfig(accessToken));
export const authLogout = async (data: any, accessToken?: string) => await $http.post("/auth/logout", data, getConfig(accessToken));
export const authRegister = async (data: any, accessToken?: string) => await $http.post("/auth/register", data, getConfig(accessToken));
export const authVerifyEmail = async (data: any, accessToken?: string) => await $http.post("/auth/verify-email", data, getConfig(accessToken));
export const authResetPassword = async (data: any, accessToken?: string) => await $http.post("/auth/reset-password", data, getConfig(accessToken));
export const authUpdatePassword = async (data: any, accessToken?: string) => await $http.post("/auth/update-password", data, getConfig(accessToken));
export const authRequestPasswordReset = async (query: string, accessToken?: string) => await $http.post(`/auth/request-password-reset?${query}`, {}, getConfig(accessToken));
export const authEmailVerification = async (query: string, accessToken?: string) => await $http.post(`/auth/request-email-verification?${query}`, {}, getConfig(accessToken));

// Users
export const usersGetAll = async (accessToken?: string) => await $http.get("/users", getConfig(accessToken));
export const usersGetOne = async (id: string, accessToken?: string) => await $http.get(`/users/${id}`, getConfig(accessToken));
export const usersCreate = async (data: any, accessToken?: string) => await $http.post("/users", data, getConfig(accessToken));
export const usersUpdate = async (id: string, data: any, accessToken?: string) => await $http.put(`/users/${id}`, data, getConfig(accessToken));
export const usersDelete = async (id: string, accessToken?: string) => await $http.delete(`/users/${id}`, getConfig(accessToken));

// Departments
export const departmentsGetAll = async (accessToken?: string) => await $http.get("/departments", getConfig(accessToken));
export const departmentsGetOne = async (id: string, accessToken?: string) => await $http.get(`/departments/${id}`, getConfig(accessToken));
export const departmentsCreate = async (data: any, accessToken?: string) => await $http.post("/departments", data, getConfig(accessToken));
export const departmentsUpdate = async (id: string, data: any, accessToken?: string) => await $http.put(`/departments/${id}`, data, getConfig(accessToken));
export const departmentsDelete = async (id: string, accessToken?: string) => await $http.delete(`/departments/${id}`, getConfig(accessToken));

// Assignments
export const assignmentsGetAll = async (query?: string, accessToken?: string) => await $http.get(`/assignments?${query}`, getConfig(accessToken));
export const assignmentsGetOne = async (id: string, accessToken?: string) => await $http.get(`/assignments/${id}`, getConfig(accessToken));
export const assignmentsCreate = async (data: FormData, accessToken?: string) => await $http.post("/assignments", data, formDataConfig(accessToken));
export const assignmentsUpdate = async (id: string, data: any, accessToken?: string) => await $http.put(`/assignments/${id}`, data, getConfig(accessToken));
export const assignmentsDelete = async (id: string, accessToken?: string) => await $http.delete(`/assignments/${id}`, getConfig(accessToken));

// Submissions
export const submissionsGetAll = async (accessToken?: string) => await $http.get("/submissions", getConfig(accessToken));
export const submissionsGetOne = async (id: string, accessToken?: string) => await $http.get(`/submissions/${id}`, getConfig(accessToken));
export const submissionsCreate = async (data: FormData, accessToken?: string) => await $http.post("/submissions", data, formDataConfig(accessToken));
export const submissionsUpdate = async (id: string, data: any, accessToken?: string) => await $http.put(`/submissions/${id}`, data, getConfig(accessToken));
export const submissionsDelete = async (id: string, accessToken?: string) => await $http.delete(`/submissions/${id}`, getConfig(accessToken));

// Results
export const resultsGetAll = async (query?: string, accessToken?: string) => await $http.get(`/results?${query}`, getConfig(accessToken));
export const resultsGetOne = async (id: string, accessToken?: string) => await $http.get(`/results/${id}`, getConfig(accessToken));
export const resultsCreate = async (data: any, accessToken?: string) => await $http.post("/results", data, getConfig(accessToken));
export const resultsUpdate = async (id: string, data: any, accessToken?: string) => await $http.put(`/results/${id}`, data, getConfig(accessToken));
export const resultsDelete = async (id: string, accessToken?: string) => await $http.delete(`/results/${id}`, getConfig(accessToken));

const getConfig = (accessToken?: string): AxiosRequestConfig => {
    const config: AxiosRequestConfig | any = {
        baseURL,
        timeout: 60000,
        headers: {
            "Content-Type": "application/json",
            "Allow-Control-Allow-Origin": frontendURL,
            "Access-Control-Allow-Credentials": "true"
        },
        withCredentials: true
    };

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
};

const formDataConfig = (accessToken?: string): AxiosRequestConfig => {
    const config: AxiosRequestConfig | any = {
        baseURL,
        timeout: 60000,
        headers: {
            "Content-Type": "multipart/form-data",
            "Allow-Control-Allow-Origin": frontendURL,
            "Access-Control-Allow-Credentials": "true"
        },
        withCredentials: true
    };

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
};
