import { AxiosRequestConfig } from "axios";
import $http, { baseURL, frontendURL } from "./xhr";

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

// Authentication
export const authLogin = async (data: any, accessToken?: string) => await $http.post("/auth/login", data, getConfig(accessToken));
export const authLogout = async (data: any, accessToken?: string) => await $http.post("/auth/logout", data, getConfig(accessToken));
export const authRegister = async (data: any, accessToken?: string) => await $http.post("/auth/register", data, getConfig(accessToken));
export const authVerifyEmail = async (data: any, accessToken?: string) => await $http.post("/auth/verify-email", data, getConfig(accessToken));
export const authResetPassword = async (data: any, accessToken?: string) => await $http.post("/auth/reset-password", data, getConfig(accessToken));
export const authUpdatePassword = async (data: any, accessToken?: string) => await $http.post("/auth/update-password", data, getConfig(accessToken));
export const authRequestPasswordReset = async (query: string, accessToken?: string) => await $http.post(`/auth/request-password-reset?${query}`, null, getConfig(accessToken));
export const authEmailVerification = async (query: string, accessToken?: string) => await $http.post(`/auth/request-email-verification?${query}`, null, getConfig(accessToken));

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
