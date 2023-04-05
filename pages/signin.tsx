import { authLogin } from "@/api";
import { getSession } from "@/api/getSession";
import { Button, TextInput } from "@/components";
import { AuthLayout } from "@/components/Layout";
import { Role } from "@/types/user";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
    email: string;
    password: string;
};

const SignIn = () => {
    const [loading, setLoading] = React.useState(false);
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormInputs>();

    const router = useRouter();

    const onSubmit = async (data: FormInputs) => {
        setLoading(true);
        try {
            const response = await authLogin({
                email: data.email,
                password: data.password
            });

            if (response.data.success) {
                const { accessToken, refreshToken } = response.data.data.token as {
                    accessToken: string;
                    refreshToken: string;
                };
                const { role } = response.data.data.user;

                console.log(process.env.NODE_ENV);

                setCookie("access_token", accessToken, {
                    maxAge: 60 * 60, // 1 hour
                    path: "/"
                });

                setCookie("refresh_token", refreshToken, {
                    maxAge: 60 * 60 * 24 * 7 * 4, // 4 weeks
                    path: "/"
                });

                if (router.query.redirect) {
                    router.push(router.query.redirect as string);
                } else {
                    if (role === Role.admin) {
                        router.push("/admin");
                    } else if (role === Role.lecturer) {
                        router.push("/dashboard");
                    } else if (role === Role.student) {
                        router.push("/assignments");
                    } else {
                        router.push("/");
                    }
                }
            }
        } catch (error: AxiosError | any) {
            if (error.response?.status === 400) {
                setError("root", {
                    type: "manual",
                    message: "Invalid email or password"
                });
            } else {
                setError("root", {
                    type: "manual",
                    message: "Something went wrong"
                });
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthLayout>
            <h1 className="text-5xl font-bold leading-tight text-center">Welcome Back!</h1>
            <p className="text-center mt-4 text-lg text-gray-500">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
                <TextInput
                    control={control}
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    rules={{
                        required: "Email is required"
                    }}
                />

                <TextInput
                    control={control}
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    rules={{
                        required: "Password is required"
                    }}
                />

                <Button loading={loading} type="submit" text="Sign in" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold" />

                {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}
            </form>

            <div className="mt-5">
                <p className="text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-green-700 hover:underline">
                        Sign up
                    </Link>
                </p>

                <p className="text-gray-500">
                    Forgot password?{" "}
                    <Link href="/forgot-password" className="text-green-700 hover:underline">
                        Reset password
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignIn;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const user = await getSession(ctx);

    if (user) {
        ctx.res.writeHead(302, { Location: "/" });
        ctx.res.end();
    }

    return {
        props: {
            user: user || null
        }
    };
}
