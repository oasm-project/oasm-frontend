import { getSession } from "@/api/getSession";
import { MainLayout } from "@/components/Layout";
import { GetServerSidePropsContext } from "next";
import React from "react";

const SignUp = () => {
    return (
        <MainLayout>
            <div className="px-5 md:px-10 pt-36 flex-1">
                <h1>Hello World! @Signup</h1>
            </div>
        </MainLayout>
    );
};

export default SignUp;

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
