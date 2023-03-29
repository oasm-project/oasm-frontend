import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

type Props = {
    children: React.ReactNode;
    noNavbar?: boolean;
    noFooter?: boolean;
};

function MainLayout({ children, noFooter, noNavbar }: Props) {
    return (
        <div className="max-w-6xl mx-auto flex flex-col min-h-screen bg-gray-50 relative">
            {!noNavbar && <Navbar />}
            {children}
            {!noFooter && <Footer />}
        </div>
    );
}

export default MainLayout;
