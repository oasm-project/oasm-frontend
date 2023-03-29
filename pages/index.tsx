import { MainLayout } from "@/components/Layout";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import React from "react";
import cookie from "cookie";
import { getSession } from "@/api/getSession";
import { IUser } from "@/types/user";

type Props = {
    user: IUser | null;
};

const Home = ({ user }: Props) => {
    return (
        <MainLayout user={user}>
            <div className="px-5 md:px-10 pt-36 flex-1">
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-10 flex flex-col justify-center items-start">
                        <h1 className="text-5xl font-bold leading-tight">
                            Online <span className="text-green-700">Assignment Submission</span> Manager
                        </h1>

                        <p className="mt-4 text-lg text-gray-500">Easily manage your assignments and submit them online. Get your assignments with ease 🤓</p>

                        <button className="mt-4 px-6 py-3 bg-green-700 text-white rounded-md font-semibold">GET STARTED</button>
                    </div>

                    <div className="w-full h-full flex justify-center items-center">
                        <div className="relative w-full aspect-square">
                            <Image src="/assets/images/hero1.svg" alt="hero image" fill />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Home;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    // TODO: Check if user is logged in, if yes, redirect to dashboard
    const user = await getSession(ctx);

    return {
        props: {
            user: user || null
        }
    };
}
