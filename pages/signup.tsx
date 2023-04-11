import { authRegister, departmentsGetAll } from "@/api";
import { getSession } from "@/api/getSession";
import { Button, Modal, SelectInput, TextInput } from "@/components";
import { AuthLayout } from "@/components/Layout";
import { ModalHandle } from "@/components/Modal";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { BsCheckCircleFill } from "react-icons/bs";

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
    const modalRef = React.useRef<ModalHandle>(null);
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
            department: departments[0]?.value
        }
    });

    const registerAs = watch("registerAs");
    const email = watch("email");

    const onSubmit = async (data: FormInputs) => {
        setLoading(true);
        try {
            const response = await authRegister({ ...data, departmentId: data.department });

            if (response.data.success) {
                modalRef.current?.open();
            }
        } catch (error: AxiosError | any) {
            if (error.response?.status === 400) {
                setError("root", {
                    type: "manual",
                    message: error.response.data.message || "Something went wrong"
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

                        <SelectInput className="sm:col-span-2" control={control} data={departments} name="department" label="Department" />
                    </>
                )}

                {/* Button */}
                <Button loading={loading} type="submit" text="Sign up" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold sm:col-span-2" />
                {errors.root && <p className="text-red-500 text-center sm:col-span-2">{errors.root.message}</p>}
            </form>

            <div className="mt-8">
                <p className="text-center text-gray-500">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-green-700 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Account Verification Link sent */}
            <Modal noCancelButton ref={modalRef} onModalClose={() => router.push("/")}>
                <div className="flex flex-col items-center justify-center max-w-[400px] p-5">
                    <div className="flex items-center justify-center w-32 h-32 bg-green-100 rounded-full">
                        <BsCheckCircleFill className="w-24 h-24 text-green-700" />
                    </div>

                    <h3 className="mt-3 text-xl font-medium text-gray-900">Account Created</h3>

                    <div className="mt-2">
                        {registerAs === "student" && (
                            <p className="text-sm text-gray-500 text-center">
                                We&apos;ve sent an email to <span className="font-medium text-gray-900">{email}</span> with a link to verify your account.
                            </p>
                        )}
                        {registerAs === "lecturer" && <p className="text-sm text-gray-500 text-center">Your account will be verified by an admin.</p>}
                    </div>
                </div>
            </Modal>
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
