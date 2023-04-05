import { authRequestPasswordReset, authResetPassword } from "@/api";
import { getSession } from "@/api/getSession";
import { Button, Modal, TextInput } from "@/components";
import { AuthLayout } from "@/components/Layout";
import { ModalHandle } from "@/components/Modal";
import { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { BsCheckCircleFill } from "react-icons/bs";

type FormInputs = {
    password: string;
    confirmPassword: string;
};

const ResetPassword = () => {
    const modalRef = React.useRef<ModalHandle>(null);
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
            if (data.password !== data.confirmPassword) {
                setError("root", {
                    type: "manual",
                    message: "Passwords do not match"
                });
                return;
            }
            const response = await authResetPassword({
                password: data.password,
                userId: router.query.uid as string,
                resetToken: router.query.resetToken as string
            });

            if (response.data.success) {
                modalRef.current?.open();
            }
        } catch (error: AxiosError | any) {
            if (error.response?.status === 400) {
                setError("root", {
                    type: "manual",
                    message: error.response.data.message
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
            <h1 className="text-5xl font-bold leading-tight text-center">Reset Password</h1>
            <p className="text-center mt-4 text-lg text-gray-500">Enter your email to reset your password</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
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

                <TextInput
                    control={control}
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    rules={{
                        required: "Confirm Password is required"
                    }}
                />

                <Button loading={loading} type="submit" text="Reset Password" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold" />

                {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}
            </form>

            {/* Password Changed Successfully */}
            <Modal noCancelButton ref={modalRef} onModalClose={() => router.push("/signin")}>
                <div className="flex flex-col items-center justify-center max-w-[400px] p-5">
                    <div className="flex items-center justify-center w-32 h-32 bg-green-100 rounded-full">
                        <BsCheckCircleFill className="w-24 h-24 text-green-700" />
                    </div>

                    <h3 className="mt-3 text-xl font-medium text-gray-900">Password Changed Successfully</h3>
                </div>
            </Modal>
        </AuthLayout>
    );
};

export default ResetPassword;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const user = await getSession(ctx);
    const { resetToken, uid } = ctx.query as { resetToken: string; uid: string };

    if (!resetToken || !uid) {
        ctx.res.writeHead(302, { Location: "/forgot-password" });
        ctx.res.end();
    }

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
