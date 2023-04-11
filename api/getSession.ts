import { IUser } from "@/types/user";
import cookie from "cookie";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

export const getSession = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>, options?: { redirect: string }) => {
    const { req, res } = ctx;

    let cookies = cookie.parse(req.headers.cookie || "");

    const refreshAccessToken = async () => {
        if (!cookies["access_token"] && cookies["refresh_token"]) {
            try {
                const response = await fetch(`${process.env.BACKEND_BASE_URL}/auth/refresh-access-token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        refreshToken: cookies.refresh_token as string
                    }),
                    credentials: "include"
                });

                const data = await response.json();

                // get set-cookie header
                const setCookie = response.headers.get("set-cookie");

                // set cookie
                if (setCookie) {
                    ctx.res.setHeader("set-cookie", setCookie);
                }

                if (data.data.accessToken) {
                    // set new access token
                    cookies.access_token = data.data.accessToken;
                }
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    };

    // refresh access token if it's expired
    await refreshAccessToken();

    // if access token is valid, get user data
    if (cookies["access_token"]) {
        try {
            const response = await fetch(`${process.env.BACKEND_BASE_URL}/users/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies["access_token"]}`
                },
                credentials: "include"
            });

            const data = await response.json();

            return data.data as IUser;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    if (options?.redirect) {
        res.writeHead(302, { Location: options.redirect });
        res.end();
    }

    return null;
};
