import Link from "next/link";
import React from "react";

type Props = {};

function Navbar({}: Props) {
    return (
        <nav className="flex justify-between items-center py-4 px-5 md:px-10 shadow-sm bg-white absolute top-0 w-full mx-auto z-10">
            <Link href="/">
                <h1 className="text-3xl font-bold">OASM</h1>
            </Link>

            <div className="space-x-5">
                <Link href="/signin">
                    <button className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-colors duration-300">
                        Sign in
                    </button>
                </Link>

                <Link href="/signup">
                    <button className="border border-green-700 bg-white text-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-colors duration-300">
                        Sign up
                    </button>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
