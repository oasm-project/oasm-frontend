import { MainLayout } from "@/components/Layout";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
    email: string;
    password: string;
};

const SignIn = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormInputs>();
    const onSubmit = (data: FormInputs) => console.log(data);
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
                                {errors.email && <span className="text-red-500">This field is required</span>}
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
                                {errors.password && <span className="text-red-500">This field is required</span>}
                            </div>

                            <button type="submit" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold">
                                Sign in
                            </button>
                        </form>
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
