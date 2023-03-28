import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

type Props = {
    children: React.ReactNode;
};

function MainLayout({ children }: Props) {
    return (
        <div className="max-w-6xl mx-auto flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="w-full px-5 md:px-10 flex-1">
                <div className="py-8">{children}</div>
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;
