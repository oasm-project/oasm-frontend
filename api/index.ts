import $http from "./xhr";

// Authentication
export const authLogin = async (data: any) => await $http.post("/auth/login", data);
export const authLogout = async (data: any) => await $http.post("/auth/logout", data);
export const authRegister = async (data: any) => await $http.post("/auth/register", data);
export const authVerifyEmail = async (data: any) => await $http.post("/auth/verify-email", data);
export const authResetPassword = async (data: any) => await $http.post("/auth/reset-password", data);
export const authUpdatePassword = async (data: any) => await $http.post("/auth/update-password", data);
export const authRequestPasswordReset = async (query: string) => await $http.post(`/auth/request-password-reset?${query}`);
export const authEmailVerification = async (query: string) => await $http.post(`/auth/request-email-verification?${query}`);
