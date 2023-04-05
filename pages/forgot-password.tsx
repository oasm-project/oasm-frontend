import { authRequestPasswordReset } from "@/api";
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
    email: string;
};

const ForgotPassword = () => {
    const modalRef = React.useRef<ModalHandle>(null);
    const [loading, setLoading] = React.useState(false);
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
        watch
    } = useForm<FormInputs>();
    const email = watch("email");

    const router = useRouter();

    const onSubmit = async (data: FormInputs) => {
        setLoading(true);
        try {
            const response = await authRequestPasswordReset(`email=${encodeURIComponent(data.email)}`);

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
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    rules={{
                        required: "Email is required"
                    }}
                />

                <Button loading={loading} type="submit" text="Reset Password" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold" />

                {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}
            </form>

            <div className="mt-5">
                <p className="text-gray-500">
                    Remember your password?{" "}
                    <Link href="/signin" className="text-green-700 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Reset Password Verification Link sent */}
            <Modal noCancelButton ref={modalRef} onModalClose={() => router.push("/signin")}>
                <div className="flex flex-col items-center justify-center max-w-[400px] p-5">
                    <div className="flex items-center justify-center w-32 h-32 bg-green-100 rounded-full">
                        <BsCheckCircleFill className="w-24 h-24 text-green-700" />
                    </div>

                    <h3 className="mt-3 text-xl font-medium text-gray-900">Password Reset Link Sent</h3>

                    <div className="mt-2">
                        <p className="text-sm text-gray-500 text-center">
                            We&apos;ve sent an email to <span className="font-medium text-gray-900">{email}</span> with a link to reset your password.
                        </p>
                    </div>
                </div>
            </Modal>
        </AuthLayout>
    );
};

export default ForgotPassword;

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
