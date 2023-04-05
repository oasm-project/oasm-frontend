import { authVerifyEmail } from "@/api";
import { Button } from "@/components";
import { AuthLayout } from "@/components/Layout";
import Modal, { ModalHandle } from "@/components/Modal";
import { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";

type Props = {};

function VerifyEmail({}: Props) {
    const successModalRef = React.useRef<ModalHandle>(null);
    const errorModalRef = React.useRef<ModalHandle>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const router = useRouter();

    const verifyEmail = async () => {
        setLoading(true);
        const { uid, verifyToken } = router.query as { uid: string; verifyToken: string };
        try {
            const response = await authVerifyEmail({
                userId: uid,
                verifyToken
            });

            if (response.data.success) {
                successModalRef.current?.open();
            }
        } catch (error: AxiosError | any) {
            if (error.response?.status === 400) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong");
            }

            errorModalRef.current?.open();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <h1 className="text-5xl font-bold leading-tight text-center">Verify Email</h1>
            <p className="text-center mt-4 text-lg text-gray-500">Click the button below to verify your email address</p>

            <div className="flex flex-col items-center justify-center mt-8">
                <Button loading={loading} onClick={verifyEmail} text="Verify Email" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold" />
            </div>

            {/* Success Modal */}
            <Modal noCancelButton ref={successModalRef} onModalClose={() => router.push("/signin")}>
                <div className="flex flex-col items-center justify-center max-w-[400px] p-5">
                    <div className="flex items-center justify-center w-32 h-32 bg-green-100 rounded-full">
                        <BsCheckCircleFill className="w-24 h-24 text-green-700" />
                    </div>
                    <h1 className="text-3xl font-bold leading-tight text-center mt-5">Email Verified</h1>
                    <p className="text-center mt-4 text-lg text-gray-500">Your email has been verified successfully</p>

                    <Button onClick={() => successModalRef.current?.close()} text="Sign In" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold mt-5" />
                </div>
            </Modal>

            {/* Error Modal */}
            <Modal noCancelButton ref={errorModalRef} onModalClose={() => router.push("/request-email-verification")}>
                <div className="flex flex-col items-center justify-center max-w-[400px] p-5">
                    <div className="flex items-center justify-center w-32 h-32 bg-red-100 rounded-full">
                        <MdCancel className="w-24 h-24 text-red-700" />
                    </div>

                    <h1 className="text-3xl font-bold leading-tight text-center mt-5">Email Verification Failed</h1>
                    <p className="text-center mt-4 text-lg text-gray-500">{error}</p>

                    <Button onClick={() => errorModalRef.current?.close()} text="Request Verification Email" className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold mt-5" />
                </div>
            </Modal>
        </AuthLayout>
    );
}

export default VerifyEmail;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { uid, verifyToken } = ctx.query;

    if (!uid || !verifyToken) {
        ctx.res.writeHead(302, { Location: "/" });
        ctx.res.end();
    }

    return {
        props: {}
    };
};
