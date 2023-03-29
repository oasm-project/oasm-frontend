import { authRegister, departmentsGetAll } from "@/api";
import { getSession } from "@/api/getSession";
import { Button, SelectInput, TextInput } from "@/components";
import { AuthLayout } from "@/components/Layout";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
    name: string;
    email: string;
    password: string;
    level?: "100" | "200" | "300" | "400";
    department?: string;
    matric?: string;
    registerAs?: "student" | "lecturer";
};

type IDepartment = {
    label: string;
    value: string;
};

type Props = {
    departments: IDepartment[];
};

const SignUp = ({ departments }: Props) => {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
        watch,
        setValue
    } = useForm<FormInputs>({
        defaultValues: {
            registerAs: "student",
            level: "100",
            department: departments[0].value
        }
    });

    const registerAs = watch("registerAs");

    const onSubmit = async (data: FormInputs) => {
        setLoading(true);
        try {
            const response = await authRegister({ ...data, departmentId: data.department });

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
                    message: error.message || "Something went wrong"
                });

                console.log(error.response.data);
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

    const REGISTER_AS_DATA = [
        {
            label: "Student",
            value: "student"
        },
        {
            label: "Lecturer",
            value: "lecturer"
        }
    ];

    const LEVEL_DATA = [
        {
            label: "100",
            value: "100"
        },
        {
            label: "200",
            value: "200"
        },
        {
            label: "300",
            value: "300"
        },
        {
            label: "400",
            value: "400"
        }
    ];

    React.useEffect(() => {
        console.log(registerAs);
    }, [registerAs]);

    React.useEffect(() => {
        if (!registerAs) setValue("registerAs", "student");
    }, [registerAs, setValue]);

    if (!registerAs) return null;

    return (
        <AuthLayout>
            <h1 className="text-5xl font-bold leading-tight text-center">Sign Up</h1>
            <p className="text-center mt-4 text-lg text-gray-500">Create your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <TextInput
                    control={control}
                    name="name"
                    type="text"
                    label="Full Name"
                    placeholder="Enter your full name"
                    rules={{
                        required: "Full Name is required"
                    }}
                />

                {registerAs === "student" && (
                    <TextInput
                        control={control}
                        name="matric"
                        type="text"
                        label="Matic"
                        placeholder="Enter your matric number"
                        rules={{
                            required: "Matic is required"
                        }}
                    />
                )}

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
                        // pattern: {
                        //     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                        //     message: "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter and one number"
                        // }
                    }}
                />

                <SelectInput control={control} data={REGISTER_AS_DATA} name="registerAs" label="Register As" defaultValue="student" />

                {registerAs === "student" && (
                    <>
                        <SelectInput control={control} data={LEVEL_DATA} name="level" label="Level" />

                        <SelectInput className="col-span-2" control={control} data={departments} name="department" label="Department" />
                    </>
                )}

                {/* Button */}
                <Button loading={loading} type="submit" text="Sign up" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold sm:col-span-2" />
                {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}
            </form>

            <div className="mt-8">
                <p className="text-center text-gray-500">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-green-700 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignUp;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const user = await getSession(ctx);

    if (user) {
        ctx.res.writeHead(302, { Location: "/" });
        ctx.res.end();
    }

    const departments: IDepartment[] = await (
        await departmentsGetAll()
    ).data.data
        .map((department: { name: string; _id: string }) => ({
            label: department.name,
            value: department._id
        }))
        .sort((a: IDepartment, b: IDepartment) => a.label.localeCompare(b.label));

    return {
        props: {
            user: user || null,
            departments
        }
    };
}
