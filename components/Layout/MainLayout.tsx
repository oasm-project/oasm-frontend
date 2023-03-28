import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

type Props = {
    children: React.ReactNode;
};

function MainLayout({ children }: Props) {
    return (
        <div className="max-w-6xl mx-auto flex flex-col min-h-screen bg-gray-50 relative">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

export default MainLayout;
