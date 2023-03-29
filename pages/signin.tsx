import { authLogin } from "@/api";
import { getSession } from "@/api/getSession";
import { Button } from "@/components";
import { MainLayout } from "@/components/Layout";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
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
        register,
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

            console.log(response);

            if (response.data.success) {
                const { accessToken, refreshToken } = response.data.data.token as {
                    accessToken: string;
                    refreshToken: string;
                };

                console.log(process.env.NODE_ENV);

                setCookie("access_token", accessToken, {
                    maxAge: 60 * 60, // 1 hour
                    path: "/"
                });

                setCookie("refresh_token", refreshToken, {
                    maxAge: 60 * 60 * 24 * 7 * 4, // 4 weeks
                    path: "/"
                });

                router.push("/admin");
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
        <MainLayout noNavbar noFooter>
            <div className="flex-1 flex justify-center items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen">
                    <div className="w-full flex flex-col justify-center items-center px-5 md:px-10">
                        <h1 className="text-5xl font-bold leading-tight text-center">Welcome Back!</h1>
                        <p className="text-center mt-4 text-lg text-gray-500">Sign in to your account to continue</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-gray-500">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                />
                                {errors.email && <p className="text-red-500">This field is required</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-gray-500">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password", { required: true })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                />
                                {errors.password && <p className="text-red-500">This field is required</p>}
                            </div>

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
                    </div>

                    <div className="w-full h-full justify-center items-center hidden lg:flex rounded-l-3xl overflow-hidden">
                        <div className="relative w-full h-full">
                            <Image className="object-cover" src="/assets/images/signin.jpg" alt="hero image" fill />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
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
