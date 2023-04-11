import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";

export const baseURL = process.env.BACKEND_BASE_URL || "http://localhost:4000";
export const frontendURL = process.env.BASE_URL || "http://localhost:3000";

const config: AxiosRequestConfig = {
    baseURL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": frontendURL,
        "Access-Control-Allow-Credentials": "true"
    },
    withCredentials: true
};

// Create new axios instance
const $http = axios.create(config);

const AUTH_PATHS = ["/signin", "/signup", "/forgot-password", "/reset-password", "/email-verification", "/request-email-verification"];

const refreshAccessToken = async () => {
    if (typeof window !== "undefined" && !hasCookie("refresh_token") && !AUTH_PATHS.includes(window.location.pathname)) {
        // redirect to signin page
        deleteCookie("access_token");
        window.location.href = "/signin";
        return;
    }
    if (!hasCookie("access_token") && hasCookie("refresh_token")) {
        console.log("refreshing access token");
        // const refreshToken: any = await jwtDecode(getCookie("refresh_token") as string);

        // Refresh access token
        try {
            await fetch(`${baseURL}/auth/refresh-access-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken: getCookie("refresh_token") as string
                }),
                credentials: "include"
            });
        } catch (error) {
            console.log(error);
            return;
        }
    }
};

$http.interceptors.request.use(async (config: AxiosRequestConfig | any) => {
    await refreshAccessToken();

    if (hasCookie("access_token")) {
        config.headers["Authorization"] = `Bearer ${getCookie("access_token")}`;
    }

    // Axios Instance does not support data object on delete request
    // Axios Instance delete only takes url and config: axios#delete(url[, config])
    // We are adding the data to the config object, and then moving it to the data object
    if (config.method === "delete" && config.deleteField) {
        config.data = {
            [config.deleteField]: config[config.deleteField]
        };

        // Delete extra fields
        delete config.deleteField;
        delete config[config.deleteField];
    }

    return config;
});

$http.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: any) => {
        if (typeof window !== "undefined" && error.response.status === 401 && error.response.data.message === "Unauthorized access: Token not found") {
            // Delete cookies
            deleteCookie("access_token");

            // Redirect to signin page
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);

export default $http;
