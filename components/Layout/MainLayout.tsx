import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

type Props = {
    children: React.ReactNode;
};

function MainLayout({ children }: Props) {
    return (
        <div className="max-w-6xl mx-auto">
            <Navbar />
            <main className="bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-8">{children}</div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;
