import { MainLayout } from "@/components/Layout";
import Image from "next/image";
import React from "react";

function Home() {
    return (
        <MainLayout>
            <div className="px-5 md:px-10 pt-36 flex-1">
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-10 flex flex-col justify-center items-start">
                        <h1 className="text-5xl font-bold leading-tight">
                            Online <span className="text-green-700">Assignment</span> Submission Manager
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
}

export default Home;
