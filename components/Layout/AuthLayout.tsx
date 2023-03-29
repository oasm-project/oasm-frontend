import Image from "next/image";
import React from "react";
import MainLayout from "./MainLayout";

type Props = {
    children: React.ReactNode;
};

function AuthLayout({ children }: Props) {
    return (
        <MainLayout noNavbar noFooter>
            <div className="flex-1 flex justify-center items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen">
                    <div className="w-full flex flex-col justify-center items-center px-5 md:px-10">{children}</div>

                    <div className="w-full h-full justify-center items-center hidden lg:flex rounded-l-3xl overflow-hidden">
                        <div className="relative w-full h-full">
                            <Image className="object-cover" src="/assets/images/signin.jpg" alt="hero image" fill />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default AuthLayout;
